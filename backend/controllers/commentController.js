const Comment = require("../models/Comment");
const Post = require("../models/Post");

const createComment = async (req, res) => {
  try {
    const { text, post } = req.body;
    const comment = await Comment.create({
      text,
      post,
      user: req.user?.id || null,
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("post")
      .populate("user", "name email");
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const post = await Post.findById(comment.post);
    const isCommentAuthor = Boolean(
      comment.user && String(comment.user) === String(req.user.id)
    );
    const isPostAuthor = Boolean(
      post && post.author && String(post.author) === String(req.user.id)
    );

    if (!isCommentAuthor && !isPostAuthor && !req.user.isAdmin) {
      return res.status(403).json({
        message: "You can delete only your own comments or comments on your own post.",
      });
    }

    await comment.deleteOne();
    res.json({ message: "Comment deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createComment, getComments, deleteComment };