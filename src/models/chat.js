const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "product" },
  sellerId: { type: Schema.Types.ObjectId, ref: "user" },
  buyerId: { type: Schema.Types.ObjectId, ref: "user" },
  deletedBySeller: { type: Boolean, require: false },
  deletedByBuyer: { type: Boolean, require: false },
});

module.exports = mongoose.model("chats", ChatSchema);
