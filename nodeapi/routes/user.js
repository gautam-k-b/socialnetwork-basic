const express = require("express");
const { allUsers, userById, getUser, updateUser, deleteUser, getUserPhoto } = require("../controllers/user");
const { requireSignIn } = require("../controllers/auth");

const router = express.Router();

router.get("/users", allUsers);
router.get("/user/:userId", requireSignIn, getUser);
router.put("/user/:userId", requireSignIn, updateUser);
router.delete("/user/:userId", requireSignIn, deleteUser);

// photo
router.get("/user/photo/:userId", getUserPhoto);

router.param("userId", userById);

module.exports = router;