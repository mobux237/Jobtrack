from sqlalchemy import create_engine, Column, Integer, String, Date
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "sqlite:///./jobtrack.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Candidature(Base):
    __tablename__ = "candidatures"

    id = Column(Integer, primary_key=True, index=True)
    entreprise = Column(String, nullable=False)
    poste = Column(String, nullable=False)
    type_contrat = Column(String, default="Alternance")
    statut = Column(String, default="Envoyée")
    date = Column(String, nullable=False)
    notes = Column(String, default="")

def init_db():
    Base.metadata.create_all(bind=engine)