import { useState } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  addDoc,
  setDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { model } from "../gemini";

function AIPlan() {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState([]);

  const generatePlan = async () => {
    try {
      setLoading(true);

      const user = auth.currentUser;

      if (!user) {
        alert("Please login again.");
        return;
      }

      const snap = await getDoc(doc(db, "users", user.uid));

      if (!snap.exists()) {
        alert("Complete onboarding first.");
        return;
      }

      const p = snap.data();

      const today = new Date().toISOString().split("T")[0];

      const prompt = `
You are an intelligent AI productivity planner.

Create a personalized schedule for TODAY.

User Details:
Name: ${p.name}
Occupation: ${p.occupation}
Wake Up: ${p.wakeUp}
Sleep: ${p.sleep}
Work Timing: ${p.workTime}
Travel Time: ${p.travelTime}
Goals: ${p.goals}
Focus Hours: ${p.studyHours}
Break Duration: ${p.breakDuration}

Rules:

1. If Occupation is "Student":
   - Create Study Sessions.
   - Use titles like:
     - Study Session 1
     - Revision
     - Assignment
     - Coding Practice

2. If Occupation is "Employee":
   - NEVER use the words "Study" or "Study Session".
   - Create work-related tasks.
   - Use titles like:
     - Office Work
     - Project Work
     - Team Meeting
     - Focus Work
     - Email & Follow-up
     - Deep Work

3. If Occupation is "Freelancer":
   - Use:
     - Client Work
     - Project Delivery
     - Client Meeting
     - Proposal Writing

4. If Occupation is "Business":
   - Use:
     - Business Operations
     - Client Calls
     - Strategy Planning
     - Team Management

5. Include:
- Wake Up
- Morning Routine
- Travel (if needed)
- Lunch
- Breaks
- Evening routine
- Sleep

6. Include every goal mentioned by the user.

7. If goals contain "Gym", include a Gym session.

8. Return ONLY valid JSON.

Example:

{
  "tasks":[
    {
      "title":"Wake Up",
      "start":"${today}T06:00:00",
      "end":"${today}T06:30:00"
    }
  ]
}
`;

      const result = await model.generateContent(prompt);

      const text = result.response.text();

      const cleanText = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const data = JSON.parse(cleanText);

      setPlan(data.tasks);

      // Save AI tasks to Firestore
      for (const task of data.tasks) {
        await addDoc(collection(db, "events"), {
          uid: user.uid,
          title: task.title,
          start: new Date(task.start),
          end: new Date(task.end),
          type: "ai",
        });
      }

      await setDoc(
        doc(db, "plans", user.uid),
        {
          date: today,
          plan: data.tasks,
        },
        { merge: true }
      );

      alert("AI Plan Generated!");
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-plan">
      <h2>🤖 AI Planner</h2>

      <button className="generate-btn" onClick={generatePlan}>
        {loading ? "Generating..." : "Generate Plan"}
      </button>

      <div className="plan-box">
        {plan.length > 0 ? (
          plan.map((task, index) => (
            <div
              key={index}
              style={{
                padding: "12px",
                marginBottom: "10px",
                background: "#f8f9ff",
                borderRadius: "10px",
                borderLeft: "5px solid #7c3aed",
              }}
            >
              <strong>
                {new Date(task.start).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {" - "}
                {new Date(task.end).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </strong>

              <br />

              {task.title}
            </div>
          ))
        ) : (
          <p>Click <b>Generate Plan</b> to create today's schedule.</p>
        )}
      </div>
    </div>
  );
}

export default AIPlan;