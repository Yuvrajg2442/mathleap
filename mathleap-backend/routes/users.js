const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/UserController");
const { check } = require("express-validator");
// const { verifyToken } = require("../middleware/auth"); // You would create this middleware later

// For now, we will comment out verifyToken as the middleware file is not created yet.
// You can add it back once you build the token verification middleware.

router.post("/register", userControllers.register);
router.post("/login", userControllers.login);
router.get("/random", userControllers.getRandomUsers);

router.get("/:username", userControllers.getUser);
// router.patch("/:id", verifyToken, userControllers.updateUser);
router.patch("/:id", userControllers.updateUser); // Temporarily public

// router.post("/follow/:id", verifyToken, userControllers.follow);
router.post("/follow/:id", userControllers.follow); // Temporarily public

// router.delete("/unfollow/:id", verifyToken, userControllers.unfollow);
router.delete("/unfollow/:id", userControllers.unfollow); // Temporarily public

router.get("/followers/:id", userControllers.getFollowers);
router.get("/following/:id", userControllers.getFollowing);

// GET all users
router.get("/", (req, res) => {
    res.json({ message: "GET all users" });
});

module.exports = router;