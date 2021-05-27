const express = require("express");
const userController = require("../controllers/user");
const productController = require("../controllers/product");
const chatController = require("../controllers/chat");
const categoryController = require("../controllers/category");
const router = express.Router();
const passport = require("../auth/auth");

router.get("/products", productController.getProducts);
router.post("/products", passport.auth, productController.addProduct);
router.get("/products/:id", productController.getProduct);
router.put("/products/:id", passport.auth, productController.updateProduct);
router.delete("/products/:id", passport.auth, productController.deleteProduct);

router.get("/categories", categoryController.getCategories);
router.post("/categories", passport.auth, categoryController.addCategory);
router.get("/categories/:categoryId", categoryController.getCategory);
router.delete(
  "/categories/:categoryId",
  passport.auth,
  categoryController.deleteCategory
);

router.post("/login", userController.userLogin);
router.post("/confirmation", passport.auth, userController.confirmationEmail);
router.get("/confirmation", passport.auth, userController.resendTokenEmail);
router.post("/users", userController.addUser);
router.get("/users", passport.auth, userController.getUser);
router.put("/users", passport.auth, userController.updateUser);
router.delete("/users", passport.auth, userController.deleteUser);
router.get("/users/:id", userController.getUserById);
router.get("/users/:username/profile", userController.getUserProfile);

router.get("/chats", passport.auth, chatController.getChats);
router.post("/chats", passport.auth, chatController.makeNewChat);
router.get("/chats/:chatid", passport.auth, chatController.getChat);
router.post("/chats/:chatid", passport.auth, chatController.addMessage);
router.delete("/chats/:chatid", passport.auth, chatController.deleteChat);
router.get(
  "/chats/:chatid/messages",
  passport.auth,
  chatController.getMessages
);

module.exports = router;
