const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  idPublisher: { type: Schema.Types.ObjectId, ref: "user" },
  image: { type: String, require: false },
  title: { type: String, require: true },
  specie: { type: String, require: false },
  size: { type: String, require: false },
  price: { type: Number, require: true },
  climate: { type: String, require: false },
  type: { type: String, require: true },
  description: { type: String, require: false },
  publishedDate: { type: Date, default: Date.now },
  subspecie: { type: String, require: false },
});

module.exports = mongoose.model("products", ProductSchema);
