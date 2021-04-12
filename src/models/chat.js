const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
  productID: { type: Schema.Types.ObjectId, ref: "product" },
  sellerID: { type: Schema.Types.ObjectId, ref: "user" },
  buyerID: { type: Schema.Types.ObjectId, ref: "user" },
  deletedBySeller: { type: Boolean, require: false },
  deletedByBuyer: { type: Boolean, require: false },
});

module.exports = mongoose.model("chats", ChatSchema);
