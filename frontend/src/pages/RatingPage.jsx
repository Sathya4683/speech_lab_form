import { useEffect, useState } from "react"
import Pagination from "../components/Pagination"
import AudioCard from "../components/AudioCard"

const BACKEND = "http://127.0.0.1:8000"
const PAGE_SIZE = 10

export default function RatingPage() {
  const [audios, setAudios] = useState([])
  const [scores, setScores] = useState({})
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [username, setUsername] = useState("")
  const [nameError, setNameError] = useState("")
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    fetch(`${BACKEND}/audios?page=${page}&page_size=${PAGE_SIZE}`)
      .then(r => r.json())
      .then(data => {
        setAudios(data.audios)
        setTotal(data.total)
      })
  }, [page])

  const toggleScore = (audio, value) => {
    setScores(prev => {
      if (prev[audio] === value) {
        const copy = { ...prev }
        delete copy[audio]
        return copy
      }
      return { ...prev, [audio]: value }
    })
  }

  const completedCount = Object.keys(scores).length
  const hasAtLeastOneScore = completedCount > 0

  const submit = async () => {
    if (!username.trim()) {
      setNameError("Please enter your name before submitting.")
      return
    }

    if (!hasAtLeastOneScore) {
      alert("Please rate at least one audio before submitting.")
      return
    }

    setNameError("")

    for (const [audio, score] of Object.entries(scores)) {
      await fetch(`${BACKEND}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, audio, score })
      })
    }

    alert("Submitted successfully")
  }

  return (
    <div
      style={{
        background: "#FFFFFF",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "20px",
          paddingBottom: "10px",
          borderBottom: "1px solid #ddd",
          overflow: "visible"
        }}
      >
        {/* Name + info */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <input
              placeholder="Your name"
              value={username}
              onChange={e => {
                setUsername(e.target.value)
                if (e.target.value.trim()) setNameError("")
              }}
              style={{ padding: "6px", fontSize: "14px", width: "180px" }}
            />
            {nameError && (
              <div style={{ color: "red", fontSize: "13px", marginTop: "4px" }}>
                {nameError}
              </div>
            )}
          </div>

          {/* Tooltip */}
          <div
            style={{ position: "relative" }}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <span style={{ cursor: "help", fontSize: "16px" }}>ℹ️</span>
            {showTooltip && (
              <div
                style={{
                  position: "absolute",
                  top: "120%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "#333",
                  color: "#fff",
                  padding: "8px 10px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  whiteSpace: "nowrap",
                  zIndex: 10
                }}
              >
                Your name is used only to identify who submitted the ratings for
                research purposes.
              </div>
            )}
          </div>
        </div>

        {/* Pagination + Progress */}
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          {audios.length > 0 && (
            <>
              <div style={{ fontSize: "14px", color: "#555" }}>
                {completedCount} / {total} completed
              </div>

              <Pagination page={page} setPage={setPage} total={total} />
            </>
          )}
        </div>
      </div>

      {/* Audio list */}
      {audios.map(a => (
        <AudioCard
          key={a}
          audio={a}
          score={scores[a]}
          onScore={v => toggleScore(a, v)}
        />
      ))}

      {/* Submit */}
      {audios.length > 0 && (
        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <button
            onClick={submit}
            disabled={!username.trim() || !hasAtLeastOneScore}
            style={{ padding: "8px 24px", fontSize: "14px", borderRadius: "4px" }}
          >
            Submit Ratings
          </button>
        </div>
      )}
    </div>
  )
}
