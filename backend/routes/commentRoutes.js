const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const optionalAuth = require("../middleware/optionalAuth");
const { createComment, getComments, deleteComment } = require("../controllers/commentController");

router.get("/:postId", getComments);
router.post("/", optionalAuth, createComment);
router.delete("/:id", auth, deleteComment);

module.exports = router;