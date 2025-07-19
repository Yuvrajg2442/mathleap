const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Helper function to create the data object sent back to the client
const getUserDict = (token, user) => {
  return {
    token,
    name: user.name, // Using 'name' to match frontend
    email: user.email,
    avatar: user.avatar,
    id: user._id
  };
};

// Helper function to build the JWT payload
const buildToken = (user) => {
  return {
    user: {
        id: user._id,
    }
  };
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body; // Changed username to name

    if (!(name && email && password)) {
      return res.status(400).json({ message: "All input required" });
    }

    const normalizedEmail = email.toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({ message: "Email must be unique" });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const avatar = `https://placehold.co/100x100/F59E0B/FFFFFF?text=${name.charAt(0).toUpperCase()}`

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      avatar
    });

    const token = jwt.sign(buildToken(user), process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.status(201).json(getUserDict(token, user));
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      return res.status(400).json({ message: "All input required" });
    }

    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(400).json({ message: "Email or password incorrect" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Email or password incorrect" });
    }

    const token = jwt.sign(buildToken(user), process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json(getUserDict(token, user));
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
};

const getRandomUsers = async (req, res) => {
    try {
        const users = await User.aggregate([{ $sample: { size: 5 } }]);
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getUser = async (req, res) => {
    try {
        const user = await User.findOne({ name: req.params.username });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const follow = async (req, res) => {
    res.status(501).json({ message: "Follow functionality not implemented yet" });
};

const unfollow = async (req, res) => {
    res.status(501).json({ message: "Unfollow functionality not implemented yet" });
};

const getFollowers = async (req, res) => {
    res.status(501).json({ message: "Get followers functionality not implemented yet" });
};

const getFollowing = async (req, res) => {
    res.status(501).json({ message: "Get following functionality not implemented yet" });
};

module.exports = {
    register,
    login,
    getRandomUsers,
    getUser,
    updateUser,
    follow,
    unfollow,
    getFollowers,
    getFollowing
};
