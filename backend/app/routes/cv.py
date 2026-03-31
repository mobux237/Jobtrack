from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/cv", tags=["CV"])

class CVRequest(BaseModel):
    prenom: str
    nom: str
    email: str
    telephone: str
    adresse: str = "Élancourt, Île-de-France"
    poste: str
    entreprise: str
    secteur: str = "Ressources Humaines"
    formation: str = "Master Gestion des Ressources Humaines"
    etablissement: str = "UVSQ – Université de Versailles Saint-Quentin-en-Yvelines"
    annee_diplome: str = "2026"
    formation_precedente: str = "Licence 3 Administration Économique et Sociale"
    experiences: str = ""
    langues: str = "Français (natif), Anglais (intermédiaire)"
    description_offre: str = ""

def extraire_competences_cv(description: str, secteur: str):
    description_lower = description.lower()

    competences_rh = {
        "recrutement": "Recrutement & sélection de candidats",
        "paie": "Gestion de la paie & administration du personnel",
        "sirh": "Maîtrise des outils SIRH",
        "formation": "Ingénierie & suivi de plan de formation",
        "droit du travail": "Droit du travail & veille juridique",
        "onboarding": "Intégration des collaborateurs (onboarding)",
        "gpec": "GPEC & gestion prévisionnelle des emplois",
        "contrat": "Rédaction & gestion des contrats de travail",
        "absenteisme": "Gestion de l'absentéisme & suivi RH",
        "dialogue social": "Relations sociales & dialogue avec les IRP",
        "reporting": "Reporting RH & tableaux de bord",
        "communication": "Communication interne & marque employeur",
    }

    competences_qhse = {
        "risques": "Évaluation & prévention des risques professionnels",
        "qualite": "Démarche qualité & amélioration continue",
        "audit": "Conduite d'audits internes & externes",
        "iso": "Connaissance des normes ISO (9001, 14001, 45001)",
        "securite": "Sécurité au travail & plans de prévention",
        "document unique": "Élaboration du Document Unique (DUERP)",
        "hse": "Management HSE & culture sécurité",
        "environnement": "Gestion environnementale & RSE",
    }

    competences_transverses = {
        "excel": "Maîtrise de Microsoft Excel (tableaux croisés, formules)",
        "powerpoint": "PowerPoint & outils de présentation",
        "pack office": "Pack Office (Word, Excel, PowerPoint)",
        "gestion de projet": "Gestion de projet & coordination",
        "analyse": "Analyse de données & restitution",
        "organisation": "Sens de l'organisation & rigueur",
        "autonomie": "Autonomie & prise d'initiative",
    }

    pool = {}
    if "qhse" in secteur.lower() or "hse" in secteur.lower():
        pool.update(competences_qhse)
        pool.update(competences_transverses)
    else:
        pool.update(competences_rh)
        pool.update(competences_transverses)

    competences_detectees = []
    for mot, label in pool.items():
        if mot in description_lower:
            competences_detectees.append(label)

    # Compétences par défaut selon secteur si rien détecté
    if not competences_detectees:
        if "qhse" in secteur.lower():
            competences_detectees = [
                "Évaluation & prévention des risques professionnels",
                "Démarche qualité & amélioration continue",
                "Connaissance des normes ISO (9001, 14001, 45001)",
                "Maîtrise du Pack Office",
            ]
        else:
            competences_detectees = [
                "Recrutement & sélection de candidats",
                "Administration du personnel & droit du travail",
                "Gestion de la paie & contrats de travail",
                "Maîtrise du Pack Office & outils SIRH",
            ]

    return competences_detectees[:6]


@router.post("/generer")
def generer_cv(data: CVRequest):
    competences = extraire_competences_cv(data.description_offre, data.secteur)

    # Expériences par défaut si non renseignées
    if data.experiences.strip():
        bloc_experiences = data.experiences.strip()
    else:
        bloc_experiences = f"""• Étudiant(e) en alternance — {data.secteur}
  Formation en cours | {data.etablissement}
  - Participation active aux missions RH/terrain
  - Gestion administrative et suivi des dossiers
  - Contribution aux projets du service"""

    cv = f"""━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{data.prenom.upper()} {data.nom.upper()}
{data.poste}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 {data.adresse}
📧 {data.email}
📞 {data.telephone}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROFIL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Étudiant(e) en {data.formation}, spécialisé(e) en {data.secteur}.
À la recherche d'une alternance en tant que {data.poste} au sein de {data.entreprise}.
Motivé(e), rigoureux(se) et force de proposition, je souhaite mettre
mes compétences au service d'une équipe dynamique.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{data.annee_diplome} (en cours)
  {data.formation}
  {data.etablissement}

2023 – 2024
  {data.formation_precedente}
  {data.etablissement}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXPÉRIENCES PROFESSIONNELLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{bloc_experiences}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMPÉTENCES CLÉS  ✦ Adaptées à l'offre
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{chr(10).join(f"  ▸ {c}" for c in competences)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LANGUES & OUTILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  {data.langues}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"""

    return {
        "cv": cv.strip(),
        "competences_detectees": competences
    }