function App() {
  return (
    <div
      style={{
        width: "350px",
        height: "450px",
        backgroundColor: "#111827",
        color: "white",
        padding: "24px",
        boxSizing: "border-box",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="text-4xl">🧠</div>

        <div>
          <h1 className="text-2xl font-bold">
            YouTube Study Guard
          </h1>

          <p className="text-gray-400 text-sm">
            Stay focused. Study smarter.
          </p>
        </div>
      </div>

      {/* Study Mode */}
      <div className="bg-gray-800 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-lg">
              Study Mode
            </h2>

            <p className="text-gray-400 text-sm">
              Block distracting videos
            </p>
          </div>

          <button className="bg-green-500 px-4 py-2 rounded-full text-sm font-bold">
            ON
          </button>
        </div>
      </div>

      {/* Timer */}
      <div className="bg-gray-800 rounded-xl p-5 text-center">
        <p className="text-gray-400 text-sm">
          Focus Timer
        </p>

        <div className="text-4xl font-bold mt-2">
          25:00
        </div>

        <button className="mt-4 bg-white text-gray-900 px-6 py-2 rounded-lg font-semibold">
          Start Focus
        </button>
      </div>
    </div>
  );
}

export default App;