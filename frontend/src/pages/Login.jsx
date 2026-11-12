import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user._id);
      localStorage.setItem("isAdmin", res.data.user.isAdmin ? "true" : "false");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-layout">
      <div className="auth-aside">
        <span className="eyebrow">GOOD TO HAVE YOU BACK</span>
        <h1>Your next<br />chapter starts<br /><em>here.</em></h1>
        <p>Pick up where you left off. There are always more stories to discover.</p>
        <div className="auth-aside-mark">“</div>
        <span className="auth-aside-caption">A COMMUNITY BUILT ON CURIOSITY.</span>
      </div>
      <div className="auth-panel">
        <div className="auth-form-wrap">
          <span className="eyebrow">WELCOME BACK</span>
          <h2>Log in to ThoughtsArchive</h2>
          <p className="form-intro">Good stories are waiting. Come on in.</p>
          {error && <div className="notice notice-error" role="alert">{error}</div>}
          <form className="form-stack" onSubmit={handleSubmit}>
            <label className="field-label">Email address<input type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required autoComplete="email" /></label>
            <label className="field-label">Password<span className="password-wrap"><input type={showPassword ? "text" : "password"} placeholder="Enter your password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required autoComplete="current-password" /><button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>{showPassword ? "Hide" : "Show"}</button></span></label>
            <button className="button form-submit" type="submit" disabled={loading}>{loading ? "Logging in..." : "Log in"} <span>↗</span></button>
          </form>
          <p className="auth-switch">New to Papertrail? <Link to="/register">Create an account</Link></p>
        </div>
      </div>
    </section>
  );
}

export default Login;
