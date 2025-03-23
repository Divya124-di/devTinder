const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const validate = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const Jwt = require("jsonwebtoken");
const userAuth = require("./middlewares/auth")

require("dotenv").config();
app.use(express.json());
app.use(cookieParser());
//signup api
app.post("/signup", async (req, res) => {
 try {
  const { firstName, lastName, emailId, password } = req.body;
  const saltRounds = 10;
   //validate the data
   validate(req);
   //Encrypt the password
const passwordHash = await bcrypt .hash(password, saltRounds)
   // Creating a new instance of the User model
   //const user = new User(req.body); -- this is not a good practice
   const user = new User({
     firstName,
     lastName,
     emailId,
     password: passwordHash,
   });
   await user.save();
   res.send("User Added successfully!");
 } catch (err) {
   res.status(400).send("ERROR:" + err.message);
 }
});
//login api
app.post("/login", async(req, res)=>{
  try{
    const {emailId, password} = req.body;
    const user = await User.findOne({emailId: emailId});
    if(!user){
      throw new Error("User not found");
    }
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if(!isPasswordMatched){
      throw new Error("Invalid password");
    }else{
      //create a jwt token
      const token = await Jwt.sign({_id:user._id}, "secretkey", {expiresIn: "1d"});
      //add token to cookie and send the response to the user
      res.cookie("token", token, {expires: new Date(Date.now() + 86400000), httpOnly: true});
      res.send("Login successful");
    }

  }catch(err){
    res.status(400).send("ERROR:" + err.message);
  }
});
//profile page
app.get("/profile", userAuth, async(req,res)=>{
  try{
  const user =req.user;
  res.send(user.firstName + "is the user");
  } catch(err){
    res.status(400).send("ERROR:" + err.message);
  }
})

//Get user by email  
app.get("/user", async(req, res)=>{
  const email = req.body.emailId;
  try{
  const users = await User.find({emailId : email});
    if(users.length===0){
      res.status(404).send("User not found");
    }else{
      res.send(users);
    }
  }catch(err){
    res.status(404).send("user not found")
  }
 
});

//Feed Api - get/Feed - Get all the user from database  
app.get("/feed", async(req, res)=>{
  try{
    const users = await User.find({});
    if(users.length===0){
      res.status(404).send("User not found");
    }else{
      res.send(users);
    }
  }catch(err){
    res.status(404).send("user not found")
  }
 
});



connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(process.env.PORT, () => {
      console.log("Server is successfully listening on port 7777...");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!");
  });

