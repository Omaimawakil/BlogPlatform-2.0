const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    // hash of the secret key given to anonymous writers (never returned by default)
    editTokenHash: { type: String, select: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);