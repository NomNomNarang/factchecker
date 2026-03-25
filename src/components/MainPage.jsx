import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Loader2 } from "lucide-react";

const API = "http://localhost:8001/api";

const EXAMPLE_CLAIMS = [
  "Earth is flat",
  "Diet Coke is healthier than Coke",
  "Taylor Swift is richer than Shah Rukh Khan"
];

const MainPage = () => {
  const [claimText, setClaimText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!claimText.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post(`${API}/fact-check`, {
        text: claimText
      });

      setResult(response.data.result);
    } catch (err) {
      console.error("Fact-check error:", err);
      setError(
        err.response?.data?.error || 
        "Failed to check the claim. Please ensure n8n is running and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = (example) => {
    setClaimText(example);
    setResult(null);
    setError(null);
  };

  const getVerdictStyles = (verdict) => {
    switch (verdict) {
      case "TRUE":
        return "bg-emerald-100/50 text-emerald-700 border-emerald-200";
      case "FALSE":
        return "bg-rose-100/50 text-rose-700 border-rose-200";
      case "UNCERTAIN":
        return "bg-amber-100/50 text-amber-700 border-amber-200";
      default:
        return "bg-gray-100/50 text-gray-700 border-gray-200";
    }
  };

  const getConfidenceColor = (verdict) => {
    switch (verdict) {
      case "TRUE":
        return "bg-gradient-to-r from-emerald-400 to-emerald-500";
      case "FALSE":
        return "bg-gradient-to-r from-rose-400 to-rose-500";
      case "UNCERTAIN":
        return "bg-gradient-to-r from-amber-400 to-amber-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-white"
    >
      <div className="absolute top-20 left-20 w-96 h-96 bg-pink-300/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-60 animate-pulse" />
      <div className="absolute top-20 right-20 w-96 h-96 bg-yellow-300/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-60 animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-300/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-60 animate-pulse" style={{ animationDelay: "2s" }} />

      <div className="w-full max-w-2xl p-8 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.04)] bg-white/70 backdrop-blur-2xl border border-white/40 z-10">
        <h1 
          className="text-4xl sm:text-5xl font-bold text-gray-900 mb-8 tracking-tight text-center"
          style={{ fontFamily: "'Outfit', 'SF Pro Display', sans-serif" }}
        >
          AI Fact-Checker
        </h1>

        <textarea
          data-testid="claim-textarea-input"
          value={claimText}
          onChange={(e) => setClaimText(e.target.value)}
          placeholder="Enter a claim (e.g., 'Dell laptops overheat a lot')"
          rows={4}
          className="w-full bg-white/90 border border-gray-200 rounded-xl p-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all resize-none shadow-sm placeholder:text-gray-400 text-gray-900"
          style={{ fontFamily: "'Inter', sans-serif" }}
        />

        <button
          data-testid="submit-claim-button"
          onClick={handleSubmit}
          disabled={loading || !claimText.trim()}
          className="mt-6 w-full sm:w-auto px-8 py-3 rounded-full text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-500 hover:from-pink-500 hover:via-purple-500 hover:to-blue-600"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <span>Check Claim</span>
          )}
        </button>

        <div className="flex flex-wrap gap-2 mt-6 justify-center">
          {EXAMPLE_CLAIMS.map((example, index) => (
            <button
              key={index}
              data-testid="example-claim-chip"
              onClick={() => handleExampleClick(example)}
              className="inline-flex items-center px-4 py-2 rounded-full bg-gray-50 border border-gray-100 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 cursor-pointer transition-colors shadow-sm"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {example}
            </button>
          ))}
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {error}
          </motion.div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mt-8 w-full bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500" style={{ fontFamily: "'Inter', sans-serif" }}>Verdict</span>
              <span
                data-testid="result-verdict-badge"
                className={`px-4 py-2 rounded-full border font-semibold text-sm ${getVerdictStyles(result.verdict)}`}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {result.verdict}
              </span>
            </div>

            {result.confidence !== undefined && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500" style={{ fontFamily: "'Inter', sans-serif" }}>Confidence</span>
                  <span className="text-sm font-medium text-gray-700" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {Math.round(result.confidence * 100)}%
                  </span>
                </div>
                <div data-testid="result-confidence-bar" className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${result.confidence * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full rounded-full ${getConfidenceColor(result.verdict)}`}
                  />
                </div>
              </div>
            )}

            {result.reason && (
              <div>
                <span className="text-sm text-gray-500 mb-2 block" style={{ fontFamily: "'Inter', sans-serif" }}>Reason</span>
                <p
                  data-testid="result-reason-text"
                  className="text-gray-700 leading-relaxed"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {result.reason}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default MainPage;