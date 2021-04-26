const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  type: { type: String, require: true },
  category: { type: String, require: false },
  subcategory: { type: String, require: false },
});

module.exports = mongoose.model("categories", CategorySchema);
