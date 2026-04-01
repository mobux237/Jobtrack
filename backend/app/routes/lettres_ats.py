from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
import pdfplumber
import docx
import io
import openai
import os
import json

router = APIRouter()
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def extraire_texte_pdf(contenu: bytes) -> str:
    texte = ""
    with pdfplumber.open(io.BytesIO(contenu)) as pdf:
        for page in pdf.pages:
            texte += page.extract_text() or ""
    return texte.strip()

def extraire_texte_docx(contenu: bytes) -> str:
    doc = docx.Document(io.BytesIO(contenu))
    return "\n".join([p.text for p in doc.paragraphs if p.text.strip()])

@router.post("/lettres/upload-ats")
async def generer_lettre_ats(
    file: UploadFile = File(...),
    description_offre: str = Form(...)
):
    contenu = await file.read()
    nom = file.filename.lower()

    if nom.endswith(".pdf"):
        texte_lettre = extraire_texte_pdf(contenu)
    elif nom.endswith(".docx"):
        texte_lettre = extraire_texte_docx(contenu)
    else:
        raise HTTPException(status_code=400, detail="Format non supporté. Utilise un PDF ou DOCX.")

    if not texte_lettre:
        raise HTTPException(status_code=422, detail="Impossible d'extraire le texte de la lettre.")

    prompt = f"""
Tu es un expert RH et rédaction de lettres de motivation percutantes.

Lettre de motivation originale du candidat :
---
{texte_lettre}
---

Offre d'emploi ciblée :
---
{description_offre}
---

Ta mission :
1. Analyse les valeurs, missions et mots-clés de l'offre
2. Réécris la lettre en adaptant UNIQUEMENT le contenu réel du candidat (ne rien inventer)
3. Intègre les mots-clés et le vocabulaire de l'entreprise naturellement
4. Rends la lettre plus percutante, personnalisée et convaincante
5. Garde le ton professionnel et authentique du candidat
6. Structure : accroche forte → motivation pour le poste → valeur ajoutée → conclusion engagée

Retourne un JSON :
{{
  "lettre": "texte complet de la lettre optimisée",
  "mots_cles_integres": ["mot1", "mot2"],
  "score_impact": 85,
  "ameliorations": ["amélioration 1", "amélioration 2"]
}}
"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
        temperature=0.5
    )

    result = json.loads(response.choices[0].message.content)
    return JSONResponse(content=result)