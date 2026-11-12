const crypto = require("crypto");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

const hashToken = (t) => crypto.createHash("sha256").update(t).digest("hex");

// owner, admin, or the anonymous writer holding the secret key
const canModify = (post, req) => {
  if (req.user?.isAdmin) return true;
  if (post.author && req.user?.id && String(post.author) === String(req.user.id)) return true;

  const supplied = req.header("x-edit-token");
  if (!post.author && post.editTokenHash && supplied) {
    const a = Buffer.from(hashToken(supplied), "hex");
    const b = Buffer.from(post.editTokenHash, "hex");
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  }
  return false;
};

const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const data = { title, content, author: req.user?.id || null };

    let editToken = null;
    if (!data.author) {
      editToken = crypto.randomBytes(24).toString("hex");
      data.editTokenHash = hashToken(editToken);
    }

    const post = await Post.create(data);
    const out = post.toObject();
    delete out.editTokenHash;
    if (editToken) out.editToken = editToken; // sent only once, at creation

    res.status(201).json(out);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("author", "name email");
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "name email");
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = await Post.findById(req.params.id).select("+editTokenHash");
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (!canModify(post, req)) {
      return res.status(403).json({ message: "Only the author can edit this post." });
    }

    if (typeof title === "string") post.title = title;
    if (typeof content === "string") post.content = content;
    await post.save();

    const out = post.toObject();
    delete out.editTokenHash;
    res.json(out);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).select("+editTokenHash");
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (!canModify(post, req)) {
      return res.status(403).json({ message: "Only the author can delete this post." });
    }

    await Comment.deleteMany({ post: post._id });
    await post.deleteOne();
    res.json({ message: "Post and its comments deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createPost, getPosts, getPostById, updatePost, deletePost };