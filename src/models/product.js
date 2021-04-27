const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  publisherId: { type: Schema.Types.ObjectId, ref: "user", required: true },
  image: { type: String, require: false },
  title: { type: String, require: true },
  category: { type: Schema.Types.ObjectId, ref: "category", required: true },
  size: { type: String, require: false },
  price: { type: Number, require: true },
  climate: { type: String, require: false },
  type: { type: String, require: true },
  description: { type: String, require: false },
  publishedDate: { type: Date, default: Date.now },
  sold: { type: Boolean, require: false },
});

module.exports = mongoose.model("products", ProductSchema);
