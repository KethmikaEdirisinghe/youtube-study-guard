import { useState, useEffect } from "react";

function StudyGuard() {
  const [reason, setReason] = useState(null);
  const [studyGoal, setStudyGoal] = useState("");
  const [searchGoal, setSearchGoal] = useState("");
  const [step, setStep] = useState(1);
  const [breakTime, setBreakTime] = useState(300);

  // Tells Step 6 which motivational message to show
  const [returnMessage, setReturnMessage] = useState(null);

  const quotes = [
    "💡 Boredom is temporary. Your goal is worth it.",
    "🎯 Just get through the next 10 minutes.",
    "🧠 You don't need motivation. You just need to start.",
    "☕ Take a short break. Come back stronger.",
    "📚 Future you will thank you for staying focused."
  ];

  const [quote, setQuote] = useState(quotes[0]);

  // Break timer
  useEffect(() => {
    if (step !== 5) {
      return;
    }

    const timer = setInterval(() => {
      setBreakTime((time) => {
        if (time <= 0) {
          return 0;
        }

        return time - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [step]);

  // Select a random motivational quote when break starts
  useEffect(() => {
    if (step !== 5) {
      return;
    }

    const randomQuote =
      quotes[Math.floor(Math.random() * quotes.length)];

    setQuote(randomQuote);
  }, [step]);

  const minutes = Math.floor(breakTime / 60);
  const seconds = breakTime % 60;

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
      {/* Step 1: Choose a reason */}
      {step === 1 && (
        <div>
          <h1>🧠 YouTube Study Guard</h1>

          <p>Why are you opening YouTube?</p>

          <button
            onClick={() => {
              setReason("study");
              setStep(2);
            }}
          >
            📚 I have something specific to study
          </button>

          <button
            onClick={() => {
              setReason("search");
              setStep(2);
            }}
          >
            🔎 I need to clarify something related to my studies
          </button>

          <button
            onClick={() => {
              setReason("bored");
              setStep(4);
            }}
          >
            😴 I'm bored and want to scroll
          </button>
        </div>
      )}

      {/* Step 2: Study */}
      {step === 2 && reason === "study" && (
        <div>
          <p>What exactly do you want to study?</p>

          <input
            type="text"
            placeholder="Enter your study goal"
            value={studyGoal}
            onChange={(event) => setStudyGoal(event.target.value)}
          />

          <button onClick={() => setStep(3)}>
            Continue
          </button>
        </div>
      )}

      {/* Step 2: Study clarification */}
      {step === 2 && reason === "search" && (
        <div>
          <p>What do you need to clarify?</p>

          <input
            type="text"
            placeholder="What are you trying to understand?"
            value={searchGoal}
            onChange={(event) => setSearchGoal(event.target.value)}
          />

          <button onClick={() => setStep(3)}>
            Continue
          </button>
        </div>
      )}

      {/* Step 3: Self-awareness */}
      {step === 3 && (
        <div>
          <p>Be honest with yourself.</p>

          <p>
            Will watching a YouTube video help you understand this better?
          </p>

          <button
            onClick={() => {
              chrome.runtime.sendMessage({
                type: "ALLOW_YOUTUBE",
              });

              const goal =
                reason === "study"
                  ? studyGoal
                  : searchGoal;

              const youtubeSearchUrl =
                "https://www.youtube.com/results?search_query=" +
                encodeURIComponent(goal);

              window.location.href = youtubeSearchUrl;
            }}
          >
            Yes, this will help me understand it
          </button>

          <button onClick={() => setStep(4)}>
            I'm probably avoiding my studies
          </button>
        </div>
      )}

      {/* Step 4: Reflection */}
      {step === 4 && (
        <div>
          {reason === "bored" ? (
            <>
              <p>😐 Feeling bored? That's okay.</p>

              <p>
                You don't need YouTube to fix boredom.
              </p>

              <p>
                Take a moment and decide what you really need right now.
              </p>
            </>
          ) : (
            <>
              <p>That's okay.</p>

              <p>
                What do you actually need right now?
              </p>
            </>
          )}

          {/* No-break path */}
          <button
            onClick={() => {
              setReturnMessage("no-break");
              setStep(6);
            }}
          >
            📚 Go back to studying
          </button>

          {/* Break path */}
          <button
            onClick={() => {
              setBreakTime(300);
              setStep(5);
            }}
          >
            ☕ Take an intentional break
          </button>
        </div>
      )}

      {/* Step 5: Intentional break */}
      {step === 5 && (
        <div>
          {breakTime > 0 ? (
            <>
              <p>☕ Take your break.</p>

              <p>
                You chose this break intentionally.
              </p>

              {/* Motivational quote */}
              <p>{quote}</p>

              {/* Small break activities */}
              <p>🚶 Take a walk</p>
              <p>💧 Drink some water</p>
              <p>👀 Rest your eyes</p>
              <p>🧘 Relax for a moment</p>

              {/* Timer */}
              <p>
                BREAK —{" "}
                {minutes < 10 ? `0${minutes}` : minutes}:
                {seconds < 10 ? `0${seconds}` : seconds}
              </p>
            </>
          ) : (
            <>
              <p>⏰ Your break is over.</p>

              <p>
                Ready to get back to studying?
              </p>
            </>
          )}

          <button
            onClick={() => {
              setReturnMessage("after-break");
              setStep(6);
            }}
          >
            📚 Back to Study
          </button>
        </div>
      )}

      {/* Step 6: Final motivational page */}
      {step === 6 && (
        <div>
          {returnMessage === "no-break" ? (
            <>
              <p>🌱 You made the choice.</p>

              <p>
                You don't need YouTube right now.
              </p>

              <p>
                Go back to what you were doing and take the next small step.
              </p>
            </>
          ) : (
            <>
              <p>☀️ Your break is over.</p>

              <p>
                You gave yourself time to reset.
              </p>

              <p>
                Now give your goal your attention again.
              </p>
            </>
          )}

          <button
            onClick={() => {
              chrome.runtime.sendMessage({
                type: "CLOSE_GUARD_TAB",
              });
            }}
          >
            📚 Back to Studying
          </button>
        </div>
      )}
    </div>
  );
}

export default StudyGuard;