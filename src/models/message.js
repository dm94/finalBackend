const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  chatId: { type: Schema.Types.ObjectId, ref: "chat", required: true },
  senderId: { type: Schema.Types.ObjectId, ref: "user", required: true },
  text: { type: String, require: true },
  date: { type: Date, default: Date.now },
  hasRead: { type: Boolean, require: false },
});

module.exports = mongoose.model("messages", MessageSchema);
