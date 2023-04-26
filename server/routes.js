const express = require('express');
const router = express.Router();
const User = require("../models/User");
const userController = require("../controllers/userController");
const chatController = require("../controllers/chatController");

// Home Screen
router.get("/", (req, res) => {
    console.log("here");
})

router.get("/users", userController.getUsers);
router.get("/:id", userController.getUserById);


// Create New Conversation
router.post("/messages/getmsg", chatController.getAllMessage)
router.post("/messages/addmsg", chatController.addMessage)

// Create New User
router.post("/register", userController.createUser);

// Login User

// Read All Users

// Read One User

module.exports = router;