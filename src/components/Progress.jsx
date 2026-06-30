import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import "./Progress.css";

function Progress() {
  const [total, setTotal] = useState(0);
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "goals"),
      where("uid", "==", user.uid)
    );

    const snapshot = await getDocs(q);

    const goals = snapshot.docs.map(doc => doc.data());

    const totalGoals = goals.length;
    const completedGoals = goals.filter(g => g.completed).length;

    setTotal(totalGoals);
    setCompleted(completedGoals);
  };

  const percentage =
    total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="progress-container">
      <h2>📊 Progress</h2>

      <div className="stats">
        <div className="stat-card">
          <h3>{total}</h3>
          <p>Total Goals</p>
        </div>

        <div className="stat-card">
          <h3>{completed}</h3>
          <p>Completed</p>
        </div>

        <div className="stat-card">
          <h3>{total - completed}</h3>
          <p>Remaining</p>
        </div>
      </div>

      <div className="progress-box">
        <h3>{percentage}% Completed</h3>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>

        <p>
          {completed} of {total} goals completed
        </p>
      </div>
    </div>
  );
}

export default Progress;