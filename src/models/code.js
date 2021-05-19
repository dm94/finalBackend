const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const codeSchema = new mongoose.Schema({
  _userId: { type: Schema.Types.ObjectId, required: true, ref: "user" },
  code: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now, expires: 43200 },
});

module.exports = mongoose.model("codes", codeSchema);