const BACKEND = "http://127.0.0.1:8000"

export default function AudioCard({ audio, score, onScore }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#fff",
        padding: "14px",
        borderRadius: "10px",
        marginBottom: "16px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.08)"
      }}
    >
      {/* Left: filename + player */}
      <div style={{ flex: 1 }}>
        <div style={{ marginBottom: "6px", fontSize: "14px" }}>
          {audio}
        </div>
        <audio
          controls
          src={`${BACKEND}/audio-files/${encodeURIComponent(audio)}`}
          style={{ width: "100%" }}
        />
      </div>

      {/* Right: rating */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginLeft: "20px",
          fontSize: "18px"
        }}
      >
        {[1, 2, 3, 4, 5].map(v => (
        <label key={v} style={{ cursor: "pointer" }}>
          <input
            type="radio"
            checked={score === v}
            onClick={() => onScore(v)}   // ← use onClick instead of onChange
            readOnly                     // ← makes it fully controlled
          />
          {v}
        </label>
       ))}
      </div>
    </div>
  )
}
