const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");
const { check } = require("express-validator");

// Validation middleware
const registerValidation = [
    check("name").notEmpty().trim().escape(),
    check("email").isEmail().normalizeEmail(),
    check("password").isLength({ min: 6 })
];

const loginValidation = [
    check("email").isEmail().normalizeEmail(),
    check("password").notEmpty()
];

// Auth routes with validation
router.post("/register", registerValidation, userController.register);
router.post("/login", loginValidation, userController.login);

module.exports = router;
