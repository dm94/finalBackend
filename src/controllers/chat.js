const controller = {};
const Chat = require("../models/chat");
const Message = require("../models/message");

controller.getChats = async (req, res) => {
  res.status(501).send();
};

controller.makeNewChat = async (req, res) => {
  res.status(501).send();
};

controller.getMessages = async (req, res) => {
  res.status(501).send();
};

controller.addMessage = async (req, res) => {
  res.status(501).send();
};

controller.deleteChat = async (req, res) => {
  res.status(501).send();
};

module.exports = controller;
