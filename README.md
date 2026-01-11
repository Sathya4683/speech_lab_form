# Audio Rating Tool

This application allows users to listen to `.wav` audio files, rate them on a scale of **1–5**, and export the collected ratings as a **CSV** file.

---

## How to Run the Application

### 1. Backend (FastAPI)

#### Step 1: Go to backend directory
```bash
cd backend
````

#### Step 2: Create and activate virtual environment

```bash
python3 -m venv venv
source venv/bin/activate
```

#### Step 3: Install dependencies

```bash
pip install -r requirements.txt
```

#### Step 4: Run the backend server

```bash
python3 main.py
```

Backend will start at:

```
http://127.0.0.1:8000
```

Make sure all `.wav` files are placed inside:

```
backend/assets/
```

---

### 2. Frontend (Vite + React)

#### Step 1: Go to frontend directory

```bash
cd frontend
```

#### Step 2: Install dependencies

```bash
npm install
npm install react-router-dom
```

#### Step 3: Start frontend

```bash
npm run dev
```

Frontend will start at:

```
http://localhost:5173
```

Open this URL in your browser to use the application.

---

## How to Use the Application

1. Select an audio range using the dropdown at the top (pagination).
2. Play each audio file using the audio player.
3. Select a rating (1–5) for each audio.
4. Enter your username.
5. Click **Submit Ratings** to save your ratings.
6. Click **Export CSV** to download all collected ratings as a CSV file.

---

## Backend Routes (For Reference)

### List audio files (paginated)

```
GET /audios?page=<page>&page_size=<page_size>
```

Returns a list of audio filenames for the selected page.

---

### Serve audio files

```
GET /audio-files/<filename>
```

Used internally by the frontend to play audio.

---

### Submit a rating

```
POST /submit
```

**Input JSON**

```json
{
  "username": "user_name",
  "audio": "file.wav",
  "score": 3
}
```

---

### Export ratings as CSV

```
GET /export
```

Downloads `ratings.csv`.

---

## Data Storage Format

### ratings.json

```json
{
  "username": {
    "audio.wav": 4,
    "audio2.wav": 2
  }
}
```

---

### ratings.csv

```csv
username,audio,score
username,audio.wav,4
username,audio2.wav,2
```

---

## Notes

* No database is used.
* Ratings are stored locally in JSON format.
* CSV is generated on demand.
* Backend handles all file operations.
* Frontend is UI-only.

---

```
