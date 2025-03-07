const { type } = require("express/lib/response");
const mongoose = require("mongoose");
const validator = require("validator");


const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("invalid email input" + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      // validate(value){
      //   if (!['male', 'female'].includes(value));
      //    throw new Error("Gender data is not valid");
      // }
      enum: ["male", "female", "other"],
    },
    photoUrl: {
      type: String,
      default:
        "https://tse2.mm.bing.net/th?id=OIP.fYA3SDtXsC0ifoDgr5M82gHaGg&pid=Api&P=0&h=220",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("invalid url input" + value);
        }
      },
    },
    about: {
      type: String,
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
