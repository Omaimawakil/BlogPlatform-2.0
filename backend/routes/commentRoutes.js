const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { createComment, getComments, deleteComment } = require("../controllers/commentController");

router.get("/:postId", getComments);
router.post("/", auth, createComment);
router.delete("/:id", auth, deleteComment);

module.exports = router;
