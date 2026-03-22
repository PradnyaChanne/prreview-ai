import { useState } from "react";
import Editor from "@monaco-editor/react";
import LanguageSelector from "./components/LanguageSelector";
import ReviewResults from "./components/ReviewResults";
import { reviewCode } from "./services/reviewService";

function App() {
  const [code, setCode] = useState("// Paste your code here...");
  const [language, setLanguage] = useState("javascript");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");

  const handleReview = async () => {
    if (!code.trim() || code === "// Paste your code here...") {
      setError("Please paste some code to review");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setActiveCategory("all");

    try {
      const data = await reviewCode(code, language);
      setResult(data);
    } catch (err) {
      setError("Failed to get review. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔍</span>
            <h1 className="text-xl font-bold text-white">PRReview AI</h1>
            <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
              Beta
            </span>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-gray-400 text-sm hidden md:block">
              AI-powered code reviews instantly
            </p>
            <a
              href="https://github.com/PradnyaChanne/prreview-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-2 rounded-lg text-sm transition-colors"
            >
              ⭐ Star on GitHub
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left — Code Input */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-200">Your Code</h2>
              <LanguageSelector value={language} onChange={setLanguage} />
            </div>

            {/* Monaco Editor */}
            <div className="rounded-lg overflow-hidden border border-gray-700">
              <Editor
                height="450px"
                language={language === "csharp" ? "csharp" : language}
                value={code}
                onChange={(val) => setCode(val || "")}
                theme="vs-dark"
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  padding: { top: 16 },
                }}
              />
            </div>

            {/* Review Button */}
            <button
              onClick={handleReview}
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Reviewing...
                </>
              ) : (
                <>Review Code →</>
              )}
            </button>

            {error && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg px-4 py-3 text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Right — Results */}
          <div>
            <h2 className="text-lg font-semibold text-gray-200 mb-4">
              Review Results
            </h2>
            {!result && !loading && (
              <div className="flex flex-col items-center justify-center h-96 border border-dashed border-gray-700 rounded-lg text-gray-500">
                <span className="text-4xl mb-3">👈</span>
                <p>Paste your code and click Review</p>
              </div>
            )}
            {loading && (
              <div className="flex flex-col items-center justify-center h-96 border border-dashed border-gray-700 rounded-lg text-gray-500">
                <span className="text-4xl mb-3 animate-bounce">🤖</span>
                <p>AI is reviewing your code...</p>
              </div>
            )}
            {result && (
              <ReviewResults
                result={result}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
              />
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-800 mt-12 py-6 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-gray-500 text-sm">
          <p>
            Built by{" "}
            <a
              href="https://github.com/PradnyaChanne"
              className="text-blue-400 hover:underline"
            >
              Pradnya Channe
            </a>
          </p>
          <p>Powered by OpenAI GPT</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
