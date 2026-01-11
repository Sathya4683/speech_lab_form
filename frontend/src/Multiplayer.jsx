import React, { useRef } from "react"

const MultiPlayer = ({ urls }) => {
  const audioRefs = useRef([])

  const onPlay = index => {
    audioRefs.current.forEach((audio, i) => {
      if (i !== index && audio) {
        audio.pause()
      }
    })
  }

  return (
    <div>
      {urls.map((url, i) => (
        <div key={i} style={{ marginBottom: "20px" }}>
          <p>{url}</p>

          <audio
            ref={el => (audioRefs.current[i] = el)}
            controls
            src={url}
            onPlay={() => onPlay(i)}
            style={{ width: "100%" }}
          >
            <source src={url} type="audio/mpeg" />
            Your browser does not support the audio tag.
          </audio>
        </div>
      ))}
    </div>
  )
}

export default MultiPlayer
