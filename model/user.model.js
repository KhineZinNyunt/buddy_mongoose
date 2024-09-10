const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: "Username is required!"
  },
  email: {
    type: String,
    unique: "email already exists!",
    match: [/.+\@.+\..+/, 'Please give a valid email address']
  }
})

module.exports = mongoose.model ('User', UserSchema)