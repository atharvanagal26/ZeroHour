import { useState } from "react";
import { model } from "../gemini";
function AIPlanner() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
const handleGenerate = async () => {
  if (!prompt.trim()) {
    alert("Please describe your day.");
    return;
  }

  try {
    const result = await model.generateContent(prompt);
    setResponse(result.response.text());
  } catch (error) {
    console.error(error);
    alert("Failed to generate plan.");
  }
};

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">🤖 AI Planner</h1>

        <p className="subtitle">
          Describe your day and let AI create a schedule.
        </p>

        <textarea
          className="input"
          rows="6"
          placeholder="Example: I have college from 9 AM to 4 PM, gym at 6 PM, and I need 2 hours for DSA..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <button
  className="login-btn"
  onClick={handleGenerate}
>
  Generate Plan
</button>

{response && (
  <div className="card" style={{ marginTop: "20px", textAlign: "left" }}>
    <h3>Your AI Plan</h3>
    <pre style={{ whiteSpace: "pre-wrap" }}>
      {response}
    </pre>
    </div>
)}

      </div>
    </div>
  );
}

export default AIPlanner;