from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.models.database import SessionLocal, Candidature, init_db

init_db()

router = APIRouter(prefix="/candidatures", tags=["Candidatures"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class CandidatureCreate(BaseModel):
    entreprise: str
    poste: str
    type_contrat: str = "Alternance"
    statut: str = "Envoyée"
    date: str
    notes: str = ""

class CandidatureUpdate(BaseModel):
    statut: str

@router.get("/")
def get_candidatures(db: Session = Depends(get_db)):
    return db.query(Candidature).all()

@router.post("/")
def create_candidature(data: CandidatureCreate, db: Session = Depends(get_db)):
    candidature = Candidature(**data.dict())
    db.add(candidature)
    db.commit()
    db.refresh(candidature)
    return candidature

@router.put("/{candidature_id}")
def update_candidature(candidature_id: int, data: CandidatureUpdate, db: Session = Depends(get_db)):
    candidature = db.query(Candidature).filter(Candidature.id == candidature_id).first()
    if not candidature:
        raise HTTPException(status_code=404, detail="Candidature introuvable")
    candidature.statut = data.statut
    db.commit()
    db.refresh(candidature)
    return candidature

@router.delete("/{candidature_id}")
def delete_candidature(candidature_id: int, db: Session = Depends(get_db)):
    candidature = db.query(Candidature).filter(Candidature.id == candidature_id).first()
    if not candidature:
        raise HTTPException(status_code=404, detail="Candidature introuvable")
    db.delete(candidature)
    db.commit()
    return {"message": "Candidature supprimée"}
@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    total = db.query(Candidature).count()
    envoyees = db.query(Candidature).filter(Candidature.statut == "Envoyée").count()
    en_attente = db.query(Candidature).filter(Candidature.statut == "En attente").count()
    entretiens = db.query(Candidature).filter(Candidature.statut == "Entretien").count()
    refus = db.query(Candidature).filter(Candidature.statut == "Refus").count()
    return {
        "total": total,
        "envoyees": envoyees,
        "en_attente": en_attente,
        "entretiens": entretiens,
        "refus": refus
    }
@router.get("/taux-reponse")
def taux_reponse():
    import sqlite3
    conn = sqlite3.connect("jobtrack.db")
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM candidatures")
    total = cursor.fetchone()[0]

    cursor.execute("""
        SELECT COUNT(*) FROM candidatures
        WHERE statut IN ('Entretien', 'Refus', 'Relance')
    """)
    avec_reponse = cursor.fetchone()[0]

    conn.close()

    taux = round((avec_reponse / total) * 100, 1) if total > 0 else 0

    return {
        "total": total,
        "avec_reponse": avec_reponse,
        "sans_reponse": total - avec_reponse,
        "taux": taux
    }