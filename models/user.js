const mongoose = require('mongoose')
const validator = require('validator')
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email you provided is not valid.");
      }
    },
  },
  profile: {
    type: Buffer
  },
  password: {
    type: String,
    validate(value) {
      if (value.toLowerCase().includes("password") || value.length < 2) {
        throw new Error("Invalid password provided.");
      }
    },
  }
});

userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', userSchema)