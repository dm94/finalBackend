const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  chatID: { type: Schema.Types.ObjectId, ref: "chat" },
  senderID: { type: String, require: true },
  text: { type: String, require: true },
  date: { type: Date, default: Date.now },
  hasRead: { type: Boolean, require: false },
});

module.exports = mongoose.model("messages", MessageSchema);
