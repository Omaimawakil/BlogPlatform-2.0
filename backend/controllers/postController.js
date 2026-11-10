const Post = require("../models/Post");
const Comment = require("../models/Comment");

const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = await Post.create({ title, content, author: req.user.id });
    res.status(201).json(post);
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
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (String(post.author) !== String(req.user.id)) {
      return res.status(403).json({ message: "Only the author can edit this post." });
    }
    if (typeof title === "string") post.title = title;
    if (typeof content === "string") post.content = content;
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (String(post.author) !== String(req.user.id)) {
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
