export default function Header() {
  return (
    <div
      style={{
        background: "#8B9D83",
        color: "#2E2E2E",
        padding: "16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "relative"
      }}
    >
      {/* Left spacer */}
      <div />

      {/* Centered title */}
      <h3
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          margin: 0
        }}
      >
        SNUC Speech Lab
      </h3>

      {/* Right button */}
      <a
        href="http://127.0.0.1:8000/export"
        style={{
          background: "#6E7F63",
          padding: "8px 16px",
          textDecoration: "none",
          color: "white",
          borderRadius: "4px",
          fontWeight: "bold"
        }}
      >
        Export CSV
      </a>
    </div>
  )
}
