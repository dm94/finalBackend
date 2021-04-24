const express = require("express");
const userController = require("../controllers/user");
const productController = require("../controllers/product");
const chatController = require("../controllers/chat");
const router = express.Router();
const passport = require("../auth/auth");

router.get("/products", productController.getProducts);
router.post("/products", passport.auth, productController.addProduct);
router.get("/products/:id", productController.getProduct);
router.patch("/products/:id", passport.auth, productController.updateProduct);
router.delete("/products/:id", passport.auth, productController.deleteProduct);

router.post("/login", userController.userLogin);
router.post("/confirmation", passport.auth, userController.confirmationEmail);
router.get("/confirmation", passport.auth, userController.resendTokenEmail);
router.post("/users", userController.addUser);
router.get("/users", passport.auth, userController.getUser);
router.patch("/users", passport.auth, userController.updateUser);
router.delete("/users", passport.auth, userController.deleteUser);
router.get("/users/:username/profile", userController.getUserProfile);

router.get("/users/:username/chats", passport.auth, chatController.getChats);
router.post("/chats", passport.auth, chatController.makeNewChat);
router.get("/chats/:chatid", passport.auth, chatController.getMessages);
router.post("/chats/:chatid", passport.auth, chatController.addMessage);
router.delete("/chats/:chatid", passport.auth, chatController.deleteChat);

module.exports = router;
