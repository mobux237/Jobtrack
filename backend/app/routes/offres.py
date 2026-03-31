from fastapi import APIRouter, HTTPException
from app.services.alternance import rechercher_offres_alternance, REGIONS

router = APIRouter(prefix="/offres", tags=["Offres"])

@router.get("/regions")
def get_regions():
    return {"regions": list(REGIONS.keys())}

@router.get("/alternance")
async def get_offres_alternance(
    romes: str = "M1502",
    region: str = "ile-de-france",
    rayon: int = 50
):
    try:
        return await rechercher_offres_alternance(romes, region, rayon)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))