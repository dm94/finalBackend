const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: { type: String, require: true },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  username: { type: String, require: true, unique: true },
  lastName: { type: String, require: false },
  dateOfBirth: { type: Date, require: false },
  emailVerified: { type: Boolean, require: false },
  createDate: { type: Date, default: Date.now },
  image: { type: String, require: false },
  location: { type: String, require: false },
});

UserSchema.pre("save", async function (next) {
  try {
    const user = this;
    const hash = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
    user.password = hash;
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.isValidPassword = async function (password) {
  const compare = await bcrypt.compare(password, this.password);
  return compare;
};

module.exports = mongoose.model("users", UserSchema);
