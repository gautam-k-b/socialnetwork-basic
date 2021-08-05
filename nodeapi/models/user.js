const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const { createHmac } = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
  },
  hashed_password: {
    type: String,
    required: true,
  },
  salt: String,
  created: {
    type: Date,
    default: Date.now,
  },
  updated: Date,
  photo: {
    data: Buffer,
    contentType: String,
  },
  about: {
    type: String,
    trim: true,
  },
});

// virtual field
userSchema
  .virtual("password")
  .set(function (password) {
    // create the temporary variable call _password
    this._password = password;

    // generate a time stamp
    this.salt = uuidv4();
    console.log("inside set function:", password);
    //encryptPassword()
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

// methods
userSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },
  encryptPassword: function (password) {
    if (!password) return "";

    try {
      return createHmac("sha256", this.salt).update(password).digest("hex");
    } catch (err) {
      console.log("Error in encryptPassword", err);
      return "";
    }
  },
};

module.exports = mongoose.model("User", userSchema);
