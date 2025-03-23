const { type } = require("express/lib/response");
const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


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

// here we cannot use arrow function because arrow function does not bind this keyword
// here we are using normal function because we need to bind this keyword
userSchema.methods.getjwt = async function(){
  const user = this; //this refers to the user instance that is calling this function 
  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return token;
}

userSchema.methods.isPasswordValid = async function (passwordInputByUser){
  const user = this;
  const passwordHash = user.password; // this refers to the user instance that is calling this function(origibal password)
     const isPasswordMatched = await bcrypt.compare(
       passwordInputByUser,
       passwordHash
     );
  return isPasswordMatched;
}

module.exports = mongoose.model("User", userSchema);
