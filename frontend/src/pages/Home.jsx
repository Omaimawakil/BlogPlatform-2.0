import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import { getEditToken } from "../services/editTokens";

function Home() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const fetchPosts = async () => {
      try {
        const res = await API.get("/posts");
        if (active) setPosts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        if (active) setError("We couldn't load the stories right now. Please try again.");
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchPosts();
    return () => { active = false; };
  }, []);

  const filteredPosts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return posts;
    return posts.filter((post) =>
      `${post.title || ""} ${post.content || ""} ${post.author?.name || "Anonymous"}`.toLowerCase().includes(query)
    );
  }, [posts, search]);

  const excerpt = (content = "") => content.length > 190 ? `${content.slice(0, 190).trim()}…` : content;

  const userId = localStorage.getItem("userId");
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const canManage = (post) =>
    isAdmin ||
    Boolean(userId && post.author && String(post.author._id || post.author) === String(userId)) ||
    Boolean(!post.author && getEditToken(post._id));

  return (
    <>
      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow"><span className="eyebrow-dot"></span> IDEAS ARE BETTER SHARED</span>
          <h1>Stories worth<br /><em>stopping for.</em></h1>
          <p>A home for curious minds, fresh perspectives, and the little things that make us think.</p>
          <div className="hero-actions">
            <a href="#stories" className="button">Explore stories <span>↓</span></a>
            <Link to="/create-post" className="text-link">Have a story? Write it <span>↗</span></Link>
          </div>
        </div>
        <div className="hero-art" aria-label="Abstract editorial illustration">
          <div className="art-orbit orbit-one"></div><div className="art-orbit orbit-two"></div>
          <div className="art-sun"></div><div className="art-paper paper-back"></div>
          <div className="art-paper paper-front"><span>YOUR NEXT<br />FAVORITE<br /><i>read.</i></span><b>VOL. 01 — OPEN MINDS</b></div>
          <span className="art-spark spark-one">✳</span><span className="art-spark spark-two">✳</span>
          <span className="art-note">READ. THINK. REPEAT.</span>
        </div>
        <div className="hero-bottom"><span>INDEPENDENT VOICES</span><span>✳</span><span>ENDLESS CURIOSITY</span><span>✳</span><span>GOOD IDEAS LIVE HERE</span></div>
      </section>

      <section className="stories-section" id="stories">
        <div className="section-heading">
          <div><span className="eyebrow">THE READING ROOM</span><h2>Fresh from the <em>community.</em></h2></div>
          <span className="post-count">{posts.length.toString().padStart(2, "0")} STORIES</span>
        </div>
        <div className="stories-toolbar">
          <p>Find something that speaks to you.</p>
          <label className="search-box"><span>⌕</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search stories..." aria-label="Search stories" /><kbd>/</kbd></label>
        </div>
        {loading ? (
          <div className="loading-state"><span className="loader"></span><p>Gathering stories...</p></div>
        ) : error ? (
          <div className="notice notice-error">{error}</div>
        ) : filteredPosts.length === 0 ? (
          <div className="empty-state"><span className="empty-icon">✳</span><h3>{search ? "No stories found." : "The first page is yours."}</h3><p>{search ? "Try another word or phrase." : "There are no posts yet. Start the conversation by sharing your first story."}</p>{!search && <Link className="button" to="/create-post">Write the first story ↗</Link>}</div>
        ) : (
          <div className="post-grid">
            {filteredPosts.map((post, index) => (
              <article className="post-card" key={post._id}>
                <div className={`card-art card-art-${index % 4}`}><span>{["THE JOURNAL", "OPEN PERSPECTIVES", "NOTES & THOUGHTS", "THE READING LIST"][index % 4]}</span><b>{["✳", "◒", "✴", "❋"][index % 4]}</b><small>NO. {(index + 1).toString().padStart(2, "0")}</small></div>
                <div className="post-card-body">
                  <div className="post-meta"><span>COMMUNITY STORY</span><span>✦</span></div>
                  <h3><Link to={`/post/${post._id}`}>{post.title}</Link></h3>
                  <p>{excerpt(post.content)}</p>
                  <div className="card-footer"><span className="author-avatar">{(post.author?.name || "Anonymous").charAt(0).toUpperCase()}</span><span className="author-name">{post.author?.name || "Anonymous"}</span><Link className="read-link" to={`/post/${post._id}`} aria-label={`Read ${post.title}`}>Read story <span>↗</span></Link></div>
                  {canManage(post) && <div className="card-management-actions"><Link to={`/post/${post._id}/edit`}>Edit</Link><Link to={`/post/${post._id}`}>Manage</Link></div>}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      <section className="write-cta"><div><span className="eyebrow">YOUR TURN</span><h2>Every great story<br />starts <em>somewhere.</em></h2></div><Link className="button button-light" to="/create-post">Share your thoughts <span>↗</span></Link></section>
    </>
  );
}

export default Home;