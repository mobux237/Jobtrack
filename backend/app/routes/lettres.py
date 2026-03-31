from fastapi import APIRouter
from pydantic import BaseModel
import re

router = APIRouter(prefix="/lettres", tags=["Lettres"])

class LettreRequest(BaseModel):
    prenom: str
    nom: str
    entreprise: str
    poste: str
    type_contrat: str = "alternance"
    secteur: str = "Ressources Humaines"
    motivation: str = ""
    description_offre: str = ""

def extraire_infos_offre(description: str):
    description_lower = description.lower()

    # Compétences RH/QHSE détectées
    competences_map = {
        "paie": "la gestion de la paie",
        "recrutement": "le recrutement et la sélection des talents",
        "formation": "l'ingénierie de formation",
        "sirh": "les outils SIRH",
        "droit du travail": "le droit du travail",
        "contrat": "la gestion des contrats de travail",
        "onboarding": "l'intégration des collaborateurs (onboarding)",
        "gpec": "la GPEC et la gestion prévisionnelle des emplois",
        "risques": "la prévention des risques professionnels",
        "qualite": "la démarche qualité",
        "sécurité": "la sécurité au travail",
        "audit": "la conduite d'audits internes",
        "iso": "les normes ISO",
        "excel": "les outils bureautiques avancés (Excel)",
        "reporting": "le reporting RH et l'analyse de données",
        "communication": "la communication interne",
        "dialogue social": "le dialogue social et les relations avec les IRP",
        "absenteisme": "la gestion de l'absentéisme",
    }

    competences_trouvees = []
    for mot, label in competences_map.items():
        if mot in description_lower:
            competences_trouvees.append(label)

    # Valeurs / culture entreprise
    valeurs = []
    if any(w in description_lower for w in ["innovation", "innovant", "digital"]):
        valeurs.append("l'innovation et la transformation digitale")
    if any(w in description_lower for w in ["rse", "responsabilité", "durable"]):
        valeurs.append("votre engagement RSE et votre démarche durable")
    if any(w in description_lower for w in ["international", "global", "monde"]):
        valeurs.append("votre dimension internationale")
    if any(w in description_lower for w in ["équipe", "collaboratif", "collectif"]):
        valeurs.append("votre culture collaborative et l'esprit d'équipe")
    if any(w in description_lower for w in ["croissance", "développement", "expansion"]):
        valeurs.append("votre dynamisme et votre forte croissance")

    return competences_trouvees[:3], valeurs[:2]


@router.post("/generer")
def generer_lettre(data: LettreRequest):
    competences, valeurs = extraire_infos_offre(data.description_offre)

    # Bloc compétences personnalisé
    if competences:
        bloc_competences = (
            f"Au cours de ma formation en Master {data.secteur}, j'ai développé de solides compétences, "
            f"notamment en {', '.join(competences[:-1]) + ' et ' + competences[-1] if len(competences) > 1 else competences[0]}. "
            f"Ces acquis me permettront d'être rapidement opérationnel(le) et de contribuer efficacement à vos équipes."
        )
    else:
        bloc_competences = (
            f"Au cours de ma formation en Master {data.secteur}, j'ai développé de solides compétences "
            f"en gestion des ressources humaines, droit du travail et développement organisationnel. "
            f"Mon parcours académique m'a permis d'acquérir une approche rigoureuse que je souhaite mettre au service de votre structure."
        )

    # Bloc motivation personnalisé
    if data.motivation:
        bloc_motivation = f"En ce qui me concerne, {data.motivation}"
    elif valeurs:
        bloc_motivation = (
            f"Votre entreprise {data.entreprise} m'attire particulièrement pour "
            f"{' ainsi que '.join(valeurs)}. "
            f"Je suis convaincu(e) que rejoindre vos équipes représente une opportunité unique d'évoluer dans un environnement stimulant et formateur."
        )
    else:
        bloc_motivation = (
            f"Votre entreprise {data.entreprise} représente pour moi une opportunité exceptionnelle "
            f"de mettre en pratique mes connaissances académiques dans un environnement professionnel stimulant."
        )

    lettre = f"""{data.prenom} {data.nom}
Élancourt, Île-de-France

À l'attention du Service des Ressources Humaines
{data.entreprise}

Objet : Candidature pour un contrat de {data.type_contrat} — {data.poste}

Madame, Monsieur,

Actuellement étudiant(e) en Master {data.secteur}, je me permets de vous adresser ma candidature pour un contrat de {data.type_contrat} au sein de {data.entreprise}, pour le poste de {data.poste}.

{bloc_motivation}

{bloc_competences}

Reconnu(e) pour mon sérieux, mon sens des responsabilités et ma capacité d'adaptation, je suis convaincu(e) que mon profil correspond aux attentes de votre équipe. Je serais honoré(e) de pouvoir contribuer activement à vos projets dans le cadre de ce contrat de {data.type_contrat}.

Dans l'attente d'un entretien qui me permettrait de vous exposer plus en détail ma motivation et mes compétences, je reste à votre entière disposition pour tout renseignement complémentaire.

Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

{data.prenom} {data.nom}
"""
    return {"lettre": lettre.strip(), "competences_detectees": competences, "valeurs_detectees": valeurs}