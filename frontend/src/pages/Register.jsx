import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await API.post("/auth/register", form);
      setSuccess(res.data.message || "Your account has been created. You can log in now.");
      setTimeout(() => navigate("/login"), 1100);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please check your details and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-layout">
      <div className="auth-aside register-aside">
        <span className="eyebrow">MAKE YOURSELF AT HOME</span>
        <h1>There’s room<br />for your <em>voice.</em></h1>
        <p>Join a community that believes every perspective has a story worth sharing.</p>
        <div className="auth-aside-mark">✳</div>
        <span className="auth-aside-caption">READ WIDELY. WRITE FREELY.</span>
      </div>
      <div className="auth-panel">
        <div className="auth-form-wrap">
          <span className="eyebrow">GET STARTED</span>
          <h2>Create your account</h2>
          <p className="form-intro">A few details and you’re part of the story.</p>
          {error && <div className="notice notice-error" role="alert">{error}</div>}
          {success && <div className="notice notice-success" role="status">{success}</div>}
          <form className="form-stack" onSubmit={handleSubmit}>
            <label className="field-label">Your name<input placeholder="What should we call you?" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required autoComplete="name" /></label>
            <label className="field-label">Email address<input type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required autoComplete="email" /></label>
            <label className="field-label">Password<span className="password-wrap"><input type={showPassword ? "text" : "password"} placeholder="Create a password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required autoComplete="new-password" /><button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>{showPassword ? "Hide" : "Show"}</button></span></label>
            <button className="button form-submit" type="submit" disabled={loading}>{loading ? "Creating account..." : "Create account"} <span>↗</span></button>
          </form>
          <p className="auth-switch">Already have an account? <Link to="/login">Log in</Link></p>
        </div>
      </div>
    </section>
  );
}

export default Register;
