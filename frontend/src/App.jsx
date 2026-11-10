import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreatePost from "./pages/CreatePost";
import PostDetails from "./pages/PostDetails";
import EditPost from "./pages/EditPost";
import SiteLayout from "./components/SiteLayout";

function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/post/:id" element={<PostDetails />} />
        <Route path="/post/:id/edit" element={<EditPost />} />
        <Route path="*" element={<main className="empty-state"><span className="eyebrow">404 · PAGE NOT FOUND</span><h1>Looks like this page wandered off.</h1><a className="button" href="/">Back to home ↗</a></main>} />
      </Route>
    </Routes>
  );
}

export default App;
