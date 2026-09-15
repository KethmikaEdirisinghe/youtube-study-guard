function StudyGuard() {
  return (
    <div
  style={{
    position: "fixed",
    top: "20px",
    right: "20px",
    zIndex: 999999,
    background: "white",
    color: "black",
    padding: "20px",
    width: "300px",
  }}
>
      <h1>🧠 YouTube Study Guard</h1>

      <p>Why are you opening YouTube?</p>

      <button>
        📚 I have something specific to study
      </button>

      <button>
        🔎 I need to find something specific
      </button>

      <button>
        🎬 I have a specific video in mind
      </button>

      <button>
        😴 I'm bored and want to scroll
      </button>
    </div>
  );
}

export default StudyGuard;