const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const validate = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const Jwt = require("jsonwebtoken");

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
      const token = await Jwt.sign({_id:user._id}, "secretkey");
      //add token to cookie and send the response to the user
      res.cookie("token", token);
      res.send("Login successful");
    }

  }catch(err){
    res.status(400).send("ERROR:" + err.message);
  }
});
//profile page
app.get("/profile", async(req,res)=>{
  try{
      const cookies = req.cookies;
  const {token} = cookies;
  if(!token){
    res.status(401).send("Unauthenticated");
  }
  //verify the token
  const decodedMessage = await Jwt.verify(token, "secretkey");
  const userId = decodedMessage._id;
  const user
  = await User.findById(userId);
  if(!user){
    res.status(404).send("User not found");
  }
  res.send(user);
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

//delete user
app.delete("/user", async(req, res)=>{
  const userid = req.body.userid;
  try{
    //const user = await User.findByIdAndDelete(id);
      const user = await User.findByIdAndDelete({_id : userid});
    res.send("User deleted");
  }catch(err){
    res.status(404).send("user not found")
  }
});

//update data from user
app.patch("/user/:userId", async (req, res) => {
  const userid = req.params?.userId;
  const data = req.body;
  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];

    const isUpdatedAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );

    if (!isUpdatedAllowed) {
      throw new Error("Updates are not allowed");
    }

    if (data.skills && data.skills.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }

    const user = await User.findByIdAndUpdate(userid, data, {
      returnDocument: "after",
      new: true,
      runValidators: true,
      context: "query",
    });

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send({ error: err.message });
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

