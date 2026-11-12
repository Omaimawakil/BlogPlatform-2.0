const crypto = require("crypto");
const Comment = require("../models/Comment");
const Post = require("../models/Post");

const hashToken = (t) => crypto.createHash("sha256").update(t).digest("hex");

const createComment = async (req, res) => {
  try {
    const { text, post } = req.body;
    const data = { text, post, user: req.user?.id || null };

    let editToken = null;
    if (!data.user) {
      editToken = crypto.randomBytes(24).toString("hex");
      data.editTokenHash = hashToken(editToken);
    }

    const comment = await Comment.create(data);
    const out = comment.toObject();
    delete out.editTokenHash;
    if (editToken) out.editToken = editToken; // sent only once
    res.status(201).json(out);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("user", "name email");
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id).select("+editTokenHash");
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const post = await Post.findById(comment.post);
    const uid = req.user?.id;

    const isAdmin = Boolean(req.user?.isAdmin);
    const isCommentAuthor = Boolean(comment.user && uid && String(comment.user) === String(uid));
    const isPostAuthor = Boolean(post?.author && uid && String(post.author) === String(uid));

    let hasToken = false;
    const supplied = req.header("x-edit-token");
    if (!comment.user && comment.editTokenHash && supplied) {
      const a = Buffer.from(hashToken(supplied), "hex");
      const b = Buffer.from(comment.editTokenHash, "hex");
      hasToken = a.length === b.length && crypto.timingSafeEqual(a, b);
    }

    if (!isAdmin && !isCommentAuthor && !isPostAuthor && !hasToken) {
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