import { useState } from "react";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Onboarding() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    occupation: "",
    wakeUp: "",
    sleep: "",
    workTime: "",
    travelTime: "",
    goals: "",
    studyHours: "",
    breakDuration: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const user = auth.currentUser;

    if (!user) {
      alert("No user is logged in!");
      return;
    }

    await setDoc(doc(db, "users", user.uid), {
      name: formData.name,
      age: formData.age,
      gender: formData.gender,
      occupation: formData.occupation,
      wakeUp: formData.wakeUp,
      sleep: formData.sleep,
      workTime: formData.workTime,
      travelTime: formData.travelTime,
      goals: formData.goals,
      studyHours: formData.studyHours,
      breakDuration: formData.breakDuration,
    });

    alert("Profile Saved Successfully!");
    navigate("/dashboard");

  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">👋 Welcome to ZeroHour</h1>
        <p className="subtitle">
          Let's personalize your AI planner.
        </p>

        <form onSubmit={handleSubmit}>

          <input
            className="input"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
          />

          <input
            className="input"
            type="number"
            name="age"
            placeholder="Age"
            onChange={handleChange}
          />

          <select
            className="input"
            name="gender"
            onChange={handleChange}
          >
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>

          <select
            className="input"
            name="occupation"
            onChange={handleChange}
          >
            <option value="">Select Occupation</option>
            <option>Student</option>
            <option>Employee</option>
            <option>Freelancer</option>
            <option>Business</option>
            <option>Other</option>
          </select>

          <label className="form-label">🌅 Wake-up Time</label>
          <input
            className="input"
            type="time"
            name="wakeUp"
            onChange={handleChange}
          />

          <label className="form-label">🌙 Sleep Time</label>
          <input
            className="input"
            type="time"
            name="sleep"
            onChange={handleChange}
          />

          <input
            className="input"
            name="workTime"
            placeholder="College / Office Timing (Example: 9 AM - 5 PM)"
            onChange={handleChange}
          />

          <input
            className="input"
            name="travelTime"
            placeholder="Travel Time (Example: 30 Minutes)"
            onChange={handleChange}
          />

          <input
            className="input"
            name="goals"
            placeholder="Goals (Example: DSA, Gym, Coding)"
            onChange={handleChange}
          />

          <label className="form-label">📚 Daily Study / Work Hours</label>
          <input
            className="input"
            type="number"
            name="studyHours"
            placeholder="Example: 5 Hours"
            onChange={handleChange}
          />

          <label className="form-label">☕ Break Duration</label>
          <input
            className="input"
            type="number"
            name="breakDuration"
            placeholder="Example: 30 Minutes"
            onChange={handleChange}
          />

          <button type="submit" className="login-btn">
            Save & Continue
          </button>

        </form>
      </div>
    </div>
  );
}

export default Onboarding;