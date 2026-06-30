import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";

function LoginCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      if (!auth.currentUser) return;

      const docRef = doc(db, "users", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        navigate("/dashboard");
      } else {
        navigate("/onboarding");
      }
    };

    checkUser();
  }, [navigate]);

  // LOGIN
  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        navigate("/dashboard");
      } else {
        navigate("/onboarding");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  // SIGN UP
  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);

      // New users go to onboarding
      navigate("/onboarding");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="card">
      <h1 className="title">Welcome Back 👋</h1>

      <p className="subtitle">
        Login to continue to ZeroHour
      </p>

      <input
        type="email"
        placeholder="Enter your email"
        className="input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Enter your password"
        className="input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="login-btn"
        onClick={handleLogin}
      >
        Login
      </button>

      <button
        className="signup-btn"
        onClick={handleSignup}
      >
        Create Account
      </button>
    </div>
  );
}

export default LoginCard;