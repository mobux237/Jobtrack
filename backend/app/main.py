from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import offres, candidatures, lettres, cv
from app.routes.cv_ats import routes as cv_ats_router
from app.routes.lettres_ats import routes as lettres_ats_router

app = FastAPI(title="JobTrack API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://jobtrack-blue-six.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_routes(offres.routes)
app.include_routes(candidatures.routes)
app.include_routes(lettres.routes)
app.include_routes(cv.routes)
app.include_routes(cv_ats_routes)
app.include_routes(lettres_ats_routes)

@app.get("/")
def read_root():
    return {"message": "Bienvenue sur JobTrack API"}

@app.get("/health")
def health_check():
    return {"status": "ok"}