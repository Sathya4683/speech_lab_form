import csv
import json
import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

#config
AUDIO_DIR = "assets"
RATINGS_FILE = "ratings.json"
CSV_FILE = "ratings.csv"

#app
app = FastAPI(title="Audio Rating Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

#pydantic models to handle rating submission (structure the  POST properly)
class RatingSubmission(BaseModel):
    username: str
    audio: str
    score: int

#helpers functions
def load_ratings():
    if not os.path.exists(RATINGS_FILE):
        return {}
    with open(RATINGS_FILE, "r") as f:
        return json.load(f)

def save_ratings(data):
    with open(RATINGS_FILE, "w") as f:
        json.dump(data, f, indent=2)


#routes

# Serve audio files
app.mount("/audio-files", StaticFiles(directory=AUDIO_DIR), name="audio-files")



#pagination + serve audio files (takes page and page_size are query params)
@app.get("/audios")
def list_audios(
    page: int = 1,
    page_size: int = 10
):
    if not os.path.exists(AUDIO_DIR):
        raise HTTPException(status_code=404, detail="Audio folder not found")

    files = sorted(
        f for f in os.listdir(AUDIO_DIR)
        if f.lower().endswith(".wav")
    )

    total = len(files)

    start = (page - 1) * page_size
    end = start + page_size

    paginated_files = files[start:end]

    return {
        "page": page,
        "page_size": page_size,
        "total": total,
        "audios": paginated_files
    }


#submit according to the pydantic basemodel and add to ratings.json
@app.post("/submit")
def submit_rating(payload: RatingSubmission):
    if not (1 <= payload.score <= 5):
        raise HTTPException(status_code=400, detail="Score must be between 1 and 5")

    ratings = load_ratings()

    if payload.username not in ratings:
        ratings[payload.username] = {}

    ratings[payload.username][payload.audio] = payload.score

    save_ratings(ratings)

    return {
        "message": "Rating saved",
        "username": payload.username,
        "audio": payload.audio,
        "score": payload.score
    }


#download to disk the ratings.csv (after converting the json to csv)
@app.get("/export")
def export_csv():
    ratings = load_ratings()

    if not ratings:
        raise HTTPException(status_code=400, detail="No ratings to export")

    with open(CSV_FILE, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["username", "audio", "score"])

        for username, audios in ratings.items():
            for audio, score in audios.items():
                writer.writerow([username, audio, score])

    return FileResponse(
        CSV_FILE,
        media_type="text/csv",
        filename="ratings.csv"
    )


#just run python3 main.py to start the server
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )
