import httpx

REGIONS = {
    "ile-de-france": {"latitude": 48.8566, "longitude": 2.3522},
    # ... idem
}

async def rechercher_offres_alternance(
    romes: list[str] | str,
    region: str,
    rayon: int = 50,
) -> dict:
    if region not in REGIONS:
        raise ValueError(f"Région inconnue : {region!r}")

    if isinstance(romes, list):
        romes = ",".join(romes)

    coords = REGIONS[region]
    url = "https://labonnealternance.apprentissage.beta.gouv.fr/api/V1/recherche-emploi"
    params = {
        "caller": "JobTrack",
        "romes": romes,
        "latitude": coords["latitude"],
        "longitude": coords["longitude"],
        "radius": rayon,
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, params=params, timeout=15.0)
            if response.is_success:
                return response.json()
            return {
                "error": f"Erreur HTTP {response.status_code}",
                "url": str(response.url),
                "detail": response.text[:300],
            }
        except httpx.TimeoutException:
            return {"error": "Timeout", "detail": "Requête dépassée (15s)"}
        except httpx.RequestError as e:
            return {"error": "Connexion impossible", "detail": str(e)}