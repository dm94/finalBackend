const express = require("express");
const userController = require("../controllers/user");
const productController = require("../controllers/product");
const chatController = require("../controllers/chat");
const router = express.Router();
const passport = require("../auth/auth");

router.get("/products", productController.getProducts);
router.post("/products", passport.auth, productController.addProduct);
router.post("/products/:id", productController.getProduct);
router.patch("/products/:id", passport.auth, productController.updateProduct);
router.delete("/products/:id", passport.auth, productController.deleteProduct);

router.post("/login", userController.userLogin);
router.post("/users", userController.addUser);
router.get("/users", passport.auth, userController.getUser);
router.patch("/users/:id", passport.auth, userController.updateUser);
router.delete("/users/:id", passport.auth, userController.deleteUser);
router.get("/users/:id/profile", userController.getUserProfile);

router.get("/users/:id/chats", passport.auth, chatController.getChats);
router.post("/users/:id/chats", passport.auth, chatController.makeNewChat);
router.get(
  "/users/:id/chats/:chatid",
  passport.auth,
  chatController.getMessages
);
router.post(
  "/users/:id/chats/:chatid",
  passport.auth,
  chatController.addMessage
);
router.delete(
  "/users/:id/chats/:chatid",
  passport.auth,
  chatController.deleteChat
);

module.exports = router;
