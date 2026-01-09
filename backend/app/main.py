import os
from dotenv import load_dotenv

# Load env vars before importing routers/services
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from .routers import billboard, playlists, auth, stats

app = FastAPI(title="Spotify Tool Backend")

app.add_middleware(
    SessionMiddleware, 
    secret_key=os.getenv("SESSION_SECRET_KEY", "supersecretkey"),
    same_site="none",
    https_only=True
) 

app.add_middleware(
    CORSMiddleware,
    # Allow local dev and production frontend (via env var or general fallback)
    allow_origins=[
        "http://127.0.0.1:5173", 
        "http://localhost:5173",
        "https://mixweaver.netlify.app",
        os.getenv("FRONTEND_URL", "*") # Allow production URL
    ], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    )

app.include_router(auth.router)
app.include_router(playlists.router)
app.include_router(billboard.router)
app.include_router(stats.router)

@app.get("/")
async def root():
    return {"status": "online", "message": "MixWeaver Backend is running"}
