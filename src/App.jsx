import { Routes, Route } from "react-router-dom";
import LoginCard from "./components/LoginCard";
import Dashboard from "./components/Dashboard";
import "./App.css";
import AIPlanner from "./components/AIPlanner";
import Onboarding from "./pages/Onboarding";
function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="container">
            <LoginCard />
          </div>
        }
      />

      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/ai-planner" element={<AIPlanner />} />
      <Route path="/onboarding" element={<Onboarding />} />
    </Routes>
  );
}

export default App;