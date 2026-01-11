import { useEffect, useState } from "react";

const BACKEND = "http://127.0.0.1:8000";
const PAGE_SIZE = 10;

function App() {
  const [audios, setAudios] = useState([]);
  const [username, setUsername] = useState("");
  const [scores, setScores] = useState({});
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  // Fetch audio list whenever page changes
  useEffect(() => {
    fetch(
      `${BACKEND}/audios?page=${page}&page_size=${PAGE_SIZE}`
    )
      .then((res) => res.json())
      .then((data) => {
        setAudios(data.audios);
        setTotal(data.total);
      })
      .catch((err) => console.error(err));
  }, [page]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const handleScoreChange = (audio, score) => {
    setScores((prev) => ({
      ...prev,
      [audio]: score,
    }));
  };

  const handleSubmit = async () => {
    if (!username) {
      alert("Enter username");
      return;
    }

    for (const [audio, score] of Object.entries(scores)) {
      await fetch(`${BACKEND}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          audio,
          score,
        }),
      });
    }

    alert("Scores submitted!");
  };

  const handleExportCSV = async () => {
    try {
      const response = await fetch(`${BACKEND}/export`);
      if (!response.ok) {
        alert("No data to export");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "ratings.csv";
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Export failed");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h2>Audio Rating Tool</h2>

      {/* 🔽 Pagination dropdown at the top */}
      <div style={{ marginBottom: "20px" }}>
        <label>
          Select audio range:{" "}
          <select
            value={page}
            onChange={(e) => setPage(Number(e.target.value))}
          >
            {Array.from({ length: totalPages }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {(i * PAGE_SIZE) + 1} –{" "}
                {Math.min((i + 1) * PAGE_SIZE, total)}
              </option>
            ))}
          </select>
        </label>
      </div>

      {audios.map((audio) => (
        <div key={audio} style={{ marginBottom: "20px" }}>
          <p><b>{audio}</b></p>

          <audio
            src={`${BACKEND}/audio-files/${encodeURIComponent(audio)}`}
            controls
          />

          <div style={{ marginTop: "8px" }}>
            {[1, 2, 3, 4, 5].map((val) => (
              <label key={val} style={{ marginRight: "10px" }}>
                <input
                  type="radio"
                  name={audio}
                  value={val}
                  checked={scores[audio] === val}
                  onChange={() => handleScoreChange(audio, val)}
                />
                {val}
              </label>
            ))}
          </div>
        </div>
      ))}

      <hr />

      <div style={{ marginTop: "20px" }}>
        <input
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br /><br />
        <button onClick={handleSubmit}>Submit Ratings</button>
      </div>

      <hr />

      <div style={{ marginTop: "20px" }}>
        <button onClick={handleExportCSV}>Export CSV</button>
      </div>
    </div>
  );
}

export default App;
