import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import { getEditToken } from "../services/editTokens";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const isAdmin = localStorage.getItem("isAdmin") === "true";

    API.get(`/posts/${id}`)
      .then(({ data }) => {
        const isOwner = Boolean(
          userId && data.author && String(data.author._id || data.author) === String(userId)
        );
        const canEdit = isOwner || isAdmin || Boolean(getEditToken(id));
        if (!canEdit) {
          setError("Only the author of this story can edit it.");
          return;
        }
        setForm({ title: data.title || "", content: data.content || "" });
      })
      .catch((err) => setError(err.response?.data?.message || "Couldn't load this story."))
      .finally(() => setLoading(false));
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await API.put(`/posts/${id}`, form);
      navigate(`/post/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't save your changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading-state"><span className="loader" /><p>Opening your story...</p></div>;

  return <section className="editor-page">
    <div className="editor-heading"><span className="eyebrow">MAKE IT EVEN BETTER</span><h1>Edit your <em>story.</em></h1><p>Your words, your way. Update your story below.</p></div>
    <div className="editor-card">
      <div className="editor-card-top"><span>EDIT STORY</span><span>✳ &nbsp; THOUGHTSARCHIVE EDITOR</span></div>
      {error && <div className="notice notice-error">{error}</div>}
      {!error && <form className="form-stack" onSubmit={submit}>
        <label className="field-label">Story title<input className="title-input" value={form.title} onChange={e => setForm({...form,title:e.target.value})} required /></label>
        <label className="field-label">Your story<textarea className="story-textarea" rows={12} value={form.content} onChange={e => setForm({...form,content:e.target.value})} required /></label>
        <div className="editor-actions"><Link to={`/post/${id}`} className="cancel-link">Cancel</Link><button className="button" disabled={saving}>{saving ? "Saving..." : "Save changes"} <span>↗</span></button></div>
      </form>}
    </div>
  </section>;
}