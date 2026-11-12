const express = require("express");
const router = express.Router();
const optionalAuth = require("../middleware/optionalAuth");
const { createPost, getPosts, getPostById, updatePost, deletePost } = require("../controllers/postController");

router.get("/", getPosts);
router.get("/:id", getPostById);
router.post("/", optionalAuth, createPost);
router.put("/:id", optionalAuth, updatePost);
router.delete("/:id", optionalAuth, deletePost);

module.exports = router;