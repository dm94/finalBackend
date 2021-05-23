const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  publisherId: { type: Schema.Types.ObjectId, ref: "user", required: true },
  images: [{ type: String, require: false }],
  title: { type: String, require: true },
  category: { type: Schema.Types.ObjectId, ref: "category" },
  size: { type: String, require: false },
  price: { type: Number, require: true },
  type: { type: String, require: true },
  description: { type: String, require: false },
  publishedDate: { type: Date, default: Date.now },
  sold: { type: Boolean, require: false, default: false },
});

module.exports = mongoose.model("products", ProductSchema);
