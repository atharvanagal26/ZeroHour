import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

function Goals() {
  const [goal, setGoal] = useState("");
  const [goals, setGoals] = useState([]);

  const loadGoals = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "goals"),
      where("uid", "==", user.uid)
    );

    const snapshot = await getDocs(q);

    const list = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    setGoals(list);
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const addGoal = async () => {
    if (!goal.trim()) return;

    await addDoc(collection(db, "goals"), {
      uid: auth.currentUser.uid,
      title: goal,
      completed: false,
    });

    setGoal("");
    loadGoals();
  };

  const toggleGoal = async (id, completed) => {
    await updateDoc(doc(db, "goals", id), {
      completed: !completed,
    });

    loadGoals();
  };

  const removeGoal = async (id) => {
    await deleteDoc(doc(db, "goals", id));
    loadGoals();
  };

  return (
    <div className="goals-container">
      <h2>🎯 My Goals</h2>

      <div className="goal-input">
        <input
          className="input"
          placeholder="Add a new goal..."
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />

        <button className="login-btn" onClick={addGoal}>
          Add
        </button>
      </div>

      {goals.map((g) => (
        <div className="goal-item" key={g.id}>
          <input
            type="checkbox"
            checked={g.completed}
            onChange={() => toggleGoal(g.id, g.completed)}
          />

          <span
            style={{
              flex: 1,
              marginLeft: 10,
              textDecoration: g.completed
                ? "line-through"
                : "none",
            }}
          >
            {g.completed ? "✅ " : "🎯 "}
            {g.title}
          </span>

          <button
            className="delete-btn"
            onClick={() => removeGoal(g.id)}
          >
            🗑
          </button>
        </div>
      ))}
    </div>
  );
}

export default Goals;