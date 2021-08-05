const express = require("express");
const { getPosts, createPost, postsByUser, postById, isPoster, deletePost, updatePost } = require("../controllers/post");
const { requireSignIn } = require("../controllers/auth");
const { userById } = require("../controllers/user");
const { createPostValidator } = require("../validator");

const router = express.Router();

router.get("/posts", getPosts);
router.post(
  "/post/new/:userId",
  requireSignIn,
  createPost,
  createPostValidator
);
router.get("/posts/by/:userId", requireSignIn, postsByUser);
router.delete("/post/:postId", requireSignIn, isPoster, deletePost);
router.put("/post/:postId", requireSignIn, isPoster, updatePost);

// any route containing :userId, our app will first execute userById
router.param("userId", userById);

// any route container : postId, our app will first execute postById
router.param("postId", postById);

module.exports = router;
