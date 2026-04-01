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

@router.post("/cv/upload-ats")
async def generer_cv_ats(
    file: UploadFile = File(...),
    description_offre: str = Form(...)
):
    contenu = await file.read()
    nom = file.filename.lower()

    if nom.endswith(".pdf"):
        texte_cv = extraire_texte_pdf(contenu)
    elif nom.endswith(".docx"):
        texte_cv = extraire_texte_docx(contenu)
    else:
        raise HTTPException(status_code=400, detail="Format non supporté. Utilise un PDF ou DOCX.")

    if not texte_cv:
        raise HTTPException(status_code=422, detail="Impossible d'extraire le texte du CV.")

    prompt = f"""
Tu es un expert RH et optimisation de CV pour les systèmes ATS.

CV original :
---
{texte_cv}
---

Offre d'emploi :
---
{description_offre}
---

Réécris le CV en adaptant uniquement le contenu réel (ne rien inventer).
Intègre les mots-clés ATS de l'offre naturellement.

Retourne un JSON :
{{
  "cv": "texte complet du CV optimisé",
  "competences_matchees": ["mot1", "mot2"],
  "score_ats": 85,
  "ameliorations": ["point 1", "point 2"]
}}
"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
        temperature=0.4
    )

    result = json.loads(response.choices[0].message.content)
    return JSONResponse(content=result)