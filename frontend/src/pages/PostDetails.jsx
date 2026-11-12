import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import { getEditToken, removeEditToken } from "../services/editTokens";
import { formatDateTime } from "../services/formatDate";
const readCommentTokens = () => {
  try {
    return JSON.parse(localStorage.getItem("commentTokens") || "{}");
  } catch {
    return {};
  }
};

const saveCommentToken = (commentId, token) => {
  const tokens = readCommentTokens();
  tokens[commentId] = token;
  localStorage.setItem("commentTokens", JSON.stringify(tokens));
};

const removeCommentToken = (commentId) => {
  const tokens = readCommentTokens();
  delete tokens[commentId];
  localStorage.setItem("commentTokens", JSON.stringify(tokens));
};

function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem("userId");
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [error, setError] = useState("");
  const [commentError, setCommentError] = useState("");
  const [commentSuccess, setCommentSuccess] = useState("");

  const fetchComments = async () => {
    const commentRes = await API.get(`/comments/${id}`);
    setComments(Array.isArray(commentRes.data) ? commentRes.data : []);
  };

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      try {
        const [postRes, commentRes] = await Promise.all([
          API.get(`/posts/${id}`),
          API.get(`/comments/${id}`)
        ]);
        if (active) {
          setPost(postRes.data);
          setComments(Array.isArray(commentRes.data) ? commentRes.data : []);
        }
      } catch (err) {
        console.error(err);
        if (active) setError("We couldn't find this story. It may have been removed.");
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchData();
    return () => { active = false; };
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setCommentError("");
    setCommentSuccess("");
    setCommentLoading(true);
    try {
      const res = await API.post("/comments", { text: text.trim(), post: id });
      if (res.data.editToken) saveCommentToken(res.data._id, res.data.editToken);
      await fetchComments();
      setText("");
      setCommentSuccess("Your comment has been added.");
    } catch (err) {
      console.error(err);
      setCommentError(err.response?.data?.message || "Couldn't add your comment. Please try again.");
    } finally {
      setCommentLoading(false);
    }
  };

  const isPostAuthor = Boolean(
    post && currentUserId && post.author && String(post.author._id || post.author) === String(currentUserId)
  );
  const hasEditKey = Boolean(post && !post.author && getEditToken(id));
  const canManagePost = isPostAuthor || isAdmin || hasEditKey;

  const canDeleteComment = (comment) =>
  isAdmin ||
  isPostAuthor ||
  Boolean(currentUserId && comment.user && String(comment.user._id || comment.user) === String(currentUserId)) ||
  Boolean(!comment.user && readCommentTokens()[comment._id]);

  const handleDeletePost = async () => {
    if (!window.confirm("Delete this story and all its comments? This cannot be undone.")) return;
    try {
      await API.delete(`/posts/${id}`);
      removeEditToken(id);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't delete this story.");
    }
  };

  const handleDeleteComment = async (commentId) => {
  if (!window.confirm("Delete this comment?")) return;
  try {
    const token = readCommentTokens()[commentId];
    await API.delete(
      `/comments/${commentId}`,
      token ? { headers: { "x-edit-token": token } } : undefined
    );
    removeCommentToken(commentId);
    await fetchComments();
  } catch (err) {
    setCommentError(err.response?.data?.message || "Couldn't delete this comment.");
  }
};

  if (loading) return <div className="loading-state detail-loading"><span className="loader"></span><p>Opening the story...</p></div>;
  if (error || !post) return <div className="empty-state"><span className="empty-icon">✳</span><h2>Story not found</h2><p>{error || "This story isn't available."}</p><Link className="button" to="/">Back to stories ↗</Link></div>;

  return (
    <article className="article-page">
      <Link className="back-link" to="/">← &nbsp; Back to all stories</Link>
      <div className="article-hero-art"><span>THE THOUGHTSARCHIVE JOURNAL</span><b>✳</b><small>A STORY FROM OUR COMMUNITY</small></div>
      {canManagePost && <div className="post-management-actions">
        <Link className="button button-small" to={`/post/${id}/edit`}>Edit story ✎</Link>
        <button className="button button-small danger-button" onClick={handleDeletePost}>Delete story ×</button>
      </div>}
      <header className="article-header">
        <span className="eyebrow">COMMUNITY STORY</span>
        <h1>{post.title}</h1>
        <div className="article-byline"><span className="author-avatar large-avatar">{(post.author?.name || "Anonymous").charAt(0).toUpperCase()}</span><div><strong>{post.author?.name || "Anonymous"}</strong><span>Author · ThoughtsArchive community</span><span>Published {formatDateTime(post.createdAt)}</span></div></div>
      </header>
      <div className="article-body"><p>{post.content}</p></div>
      <div className="article-endmark">✳</div>
      <section className="comments-section">
        <div className="comments-heading"><div><span className="eyebrow">JOIN THE CONVERSATION</span><h2>Notes from <em>readers.</em></h2></div><span className="comment-count">{comments.length.toString().padStart(2, "0")} COMMENTS</span></div>
        <form className="comment-form" onSubmit={handleCommentSubmit}>
          <label htmlFor="comment-text" className="field-label">Leave a thoughtful note</label>
          <textarea id="comment-text" rows={3} placeholder="Add to the conversation..." value={text} onChange={(e) => setText(e.target.value)} required />
          {commentError && <div className="notice notice-error">{commentError}</div>}
          {commentSuccess && <div className="notice notice-success">{commentSuccess}</div>}
          <div className="comment-submit-row"><span>Keep it kind. Keep it curious.</span><button className="button" type="submit" disabled={commentLoading || !text.trim()}>{commentLoading ? "Posting..." : "Post comment"} <span>↗</span></button></div>
        </form>
        <div className="comment-list">
          {comments.length === 0 ? <div className="no-comments">No comments yet. Be the first to leave a note.</div> : comments.map((comment) => (
            <div className="comment-item" key={comment._id}>
              <span className="author-avatar">{(comment.user?.name || "Anonymous").charAt(0).toUpperCase()}</span>
              <div className="comment-content"><div className="comment-author">{comment.user?.name || "Anonymous"} <span>{comment.user ? "COMMUNITY MEMBER" : "GUEST"}</span></div><p>{comment.text}</p></div>
              {canDeleteComment(comment) && <button className="text-action danger-text" onClick={() => handleDeleteComment(comment._id)}>Delete</button>}
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}

export default PostDetails;