import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { saveEditToken } from "../services/editTokens";

function CreatePost() {
  const [form, setForm] = useState({ title: "", content: "" });
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
      const res = await API.post("/posts", form);
        
   console.log("create response:", res.data);   // add this line
   if (res.data.editToken) saveEditToken(res.data._id, res.data.editToken);
      if (res.data.editToken) saveEditToken(res.data._id, res.data.editToken);
      setSuccess("Your story has been published.");
      setTimeout(() => navigate("/"), 900);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Couldn't publish your story. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="editor-page">
      <div className="editor-heading"><span className="eyebrow">THE FLOOR IS YOURS</span><h1>Put it into <em>words.</em></h1><p>Big idea, small observation, or something in between. We'd love to read it.</p></div>
      <div className="editor-card">
        <div className="editor-card-top"><span>NEW STORY</span><span>✳ &nbsp; THOUGHTSARCHIVE EDITOR</span></div>
        {error && <div className="notice notice-error">{error}</div>}
        {success && <div className="notice notice-success">{success}</div>}
        <form className="form-stack" onSubmit={handleSubmit}>
          <label className="field-label">Story title<input className="title-input" type="text" placeholder="Give your story a title..." value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></label>
          <label className="field-label">Your story<textarea className="story-textarea" placeholder="Start writing here. Don't overthink it..." value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required rows={11} /></label>
          <div className="editor-actions"><Link to="/" className="cancel-link">Cancel</Link><button className="button" type="submit" disabled={loading}>{loading ? "Publishing..." : "Publish story"} <span>↗</span></button></div>
        </form>
      </div>
      <p className="editor-footnote">NOT LOGGED IN? YOU CAN STILL EDIT YOUR STORY FROM THIS BROWSER.</p>
    </section>
  );
}

export default CreatePost;