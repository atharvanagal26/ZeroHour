import { useState } from "react";
import "./Dashboard.css";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import AIPlan from "./AIPlan";
import CalendarView from "./CalendarView";
import Goals from "../components/Goals";
import Progress from "../components/Progress";

function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("planner");

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const events = [
    {
      title: "Wake Up",
      start: new Date(2026, 5, 28, 6, 0),
      end: new Date(2026, 5, 28, 6, 30),
    },
    {
      title: "College",
      start: new Date(2026, 5, 28, 9, 0),
      end: new Date(2026, 5, 28, 16, 0),
    },
  ];

  return (
    <div className="dashboard">
      <header className="topbar">
        <div className="header-content">
          <div>
            <h1>👋 Welcome Back!</h1>
            <p>AI-powered Smart Daily Planner</p>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </header>

      <div className="main">

        <div className="sidebar">
          <button
            className={activeTab === "planner" ? "menu active" : "menu"}
            onClick={() => setActiveTab("planner")}
          >
            🤖 AI Planner
          </button>

          <button
            className={activeTab === "calendar" ? "menu active" : "menu"}
            onClick={() => setActiveTab("calendar")}
          >
            📅 Calendar
          </button>

          <button
            className={activeTab === "goals" ? "menu active" : "menu"}
            onClick={() => setActiveTab("goals")}
          >
            🎯 Goals
          </button>

          <button
            className={activeTab === "progress" ? "menu active" : "menu"}
            onClick={() => setActiveTab("progress")}
          >
            📊 Progress
          </button>
        </div>

        <div className="content">
          {activeTab === "planner" && <AIPlan />}

          {activeTab === "calendar" && <CalendarView />}

          {activeTab === "goals" && <Goals />}

          {activeTab === "progress" && <Progress />}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;