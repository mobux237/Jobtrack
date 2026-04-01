from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import offres, candidatures, lettres, cv
from routers.lettres_ats import router as lettres_ats_router
app.include_router(lettres_ats_router)
from routers.cv_ats import router as cv_ats_router
app.include_router(cv_ats_router)

app = FastAPI(title="JobTrack API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:3000",
    "https://jobtrack-blue-six.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(offres.router)
app.include_router(candidatures.router)
app.include_router(lettres.router)
app.include_router(cv.router)

@app.get("/")
def read_root():
    return {"message": "Bienvenue sur JobTrack API"}

@app.get("/health")
def health_check():
    return {"status": "ok"}