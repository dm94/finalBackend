const controller = {};
const Chat = require("../models/chat");
const Message = require("../models/message");
const Product = require("../models/product");

controller.getChats = async (req, res) => {
  try {
    let chats = await Chat.find({
      $or: [{ sellerId: req.user._id }, { buyerId: req.user._id }],
    });

    chats = chats.filter(
      (chat) =>
        !(chat.sellerId.equals(req.user._id) && chat.deletedBySeller) &&
        !(chat.buyerId.equals(req.user._id) && chat.deletedByBuyer)
    );

    res.status(200).send(chats);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
};

controller.makeNewChat = async (req, res) => {
  try {
    let buyer = req.user;

    if (req.body.idProduct) {
      const product = await Product.findOne({ _id: req.body.idProduct });

      if (product) {
        const chatExist = await Chat.exists({
          productId: product._id,
          buyerId: buyer._id,
        });
        if (!chatExist) {
          let newChat = new Chat({
            productId: product._id,
            sellerId: product.publisherId,
            buyerId: buyer,
          });
          await newChat.save();
        }
        const chat = await Chat.findOne({
          productId: product._id,
          buyerId: buyer._id,
        });
        if (chat) {
          return res.status(201).send(chat);
        }
        return res.status(500).send();
      } else {
        res.status(404).send({ error: "Product not found" });
      }
    } else {
      res.status(400).send();
    }
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
};

controller.getMessages = async (req, res) => {
  try {
    const chatId = req.params.chatid;
    const chat = await Chat.findById(String(chatId));

    if (
      chat &&
      (chat.sellerId.equals(req.user._id) || chat.buyerId.equals(req.user._id))
    ) {
      let messages = await Message.find({ chatId: chatId });

      messages.forEach((message) => {
        if (!message.senderId.equals(req.user._id)) {
          message.hasRead = true;
          message.save();
        }
      });

      res.status(200).send(messages);
    } else {
      res.status(403).send();
    }
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
};

controller.getChat = async (req, res) => {
  try {
    const chatId = req.params.chatid;

    if (chatId) {
      const chat = await Chat.findById(String(chatId));
      if (chat) {
        if (
          chat.sellerId.equals(req.user._id) ||
          chat.buyerId.equals(req.user._id)
        ) {
          return res.status(200).send(chat);
        }
        return res.status(403).send();
      }
      return res.status(404).send();
    }
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
};

controller.addMessage = async (req, res) => {
  try {
    const chatId = req.params.chatid;

    if (chatId && req.body.message) {
      const chat = await Chat.findById(chatId);
      if (chat) {
        if (
          chat.sellerId.equals(req.user._id) ||
          chat.buyerId.equals(req.user._id)
        ) {
          let newMessage = new Message({
            chatId: chat._id,
            senderId: req.user._id,
            text: req.body.message,
          });
          await newMessage.save();

          const message = await Message.findOne({
            chatId: chat._id,
            senderId: req.user._id,
            text: req.body.message,
          });

          return res.status(201).send(message);
        } else {
          return res.status(403).send();
        }
      }
      return res.status(404).send();
    }
    res.status(400).send();
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
};

controller.deleteChat = async (req, res) => {
  try {
    const chatId = req.params.chatid;

    if (chatId != null) {
      const chat = await Chat.findById(String(chatId));

      if (chat) {
        if (chat.sellerId.equals(req.user._id)) {
          chat.deletedBySeller = true;
          await chat.save();
        } else if (chat.buyerId.equals(req.user._id)) {
          chat.deletedByBuyer = true;
          await chat.save();
        } else {
          return res.status(401).send();
        }
        if (chat.deletedByBuyer && chat.deletedBySeller) {
          try {
            await Chat.findByIdAndDelete(chat);
            await Message.deleteMany({ chatId: String(chatId) });
            return res.status(204).send();
          } catch (err) {
            console.log(err);
            return res.status(500).send({ error: "Chat could not be deleted" });
          }
        }
      }
      return res.status(404).send();
    }
    return res.status(400).send();
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
};

module.exports = controller;
