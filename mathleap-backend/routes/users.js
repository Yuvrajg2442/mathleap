const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/UserController");

// User routes (non-auth)
router.get("/random", userControllers.getRandomUsers);
router.get("/:username", userControllers.getUser);
router.patch("/:id", userControllers.updateUser);
router.post("/follow/:id", userControllers.follow);
router.delete("/unfollow/:id", userControllers.unfollow);
router.get("/followers/:id", userControllers.getFollowers);
router.get("/following/:id", userControllers.getFollowing);

// GET all users
router.get("/", (req, res) => {
    res.json({ message: "GET all users" });
});

module.exports = router;