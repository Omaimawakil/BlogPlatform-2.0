import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SiteLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const loggedIn = Boolean(localStorage.getItem("token"));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("isAdmin");
    setMenuOpen(false);
    navigate("/");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="nav-wrap">
          <Link className="brand" to="/" onClick={closeMenu}>
            <span className="brand-mark">B</span>
            <span>Thoughts<span className="brand-accent">Archive</span></span>
          </Link>
          <button className="menu-toggle" aria-label="Toggle navigation" onClick={() => setMenuOpen(!menuOpen)}>
            <span></span><span></span><span></span>
          </button>
          <nav className={menuOpen ? "main-nav is-open" : "main-nav"}>
            <NavLink to="/" onClick={closeMenu}>Explore</NavLink>
            <NavLink to="/create-post" onClick={closeMenu}>Write a story</NavLink>
            {loggedIn ? (
              <button className="nav-logout" onClick={logout}>Log out</button>
            ) : (
              <>
                <NavLink className="nav-login" to="/login" onClick={closeMenu}>Log in</NavLink>
                <Link className="button button-small" to="/register" onClick={closeMenu}>Get started <span>↗</span></Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="page-content"><Outlet /></main>
      <footer className="site-footer">
       <Link className="footer-brand" to="/">ThoughtsArchive</Link>
        <span></span>
        <span>© {new Date().getFullYear()} ThoughtsArchive</span>
      </footer> 
    </div>
    )
  }    
  