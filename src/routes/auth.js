const express = require("express");
const authRouter = express.Router();
const { validate } = require("../utils/validation");

const User = require("../models/user");
const bcrypt = require("bcrypt");


//signup api
authRouter.post("/signup", async (req, res) => {
 try {
  const { firstName, lastName, emailId, password } = req.body;
  const saltRounds = 10;
   //validate the data
   validate(req);
   //Encrypt the password
const passwordHash = await bcrypt.hash(password, saltRounds)
   // Creating a new instance of the User model
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
authRouter.post("/login", async(req, res)=>{
  try{
    const {emailId, password} = req.body;
    const user = await User.findOne({emailId: emailId});
    if(!user){
      throw new Error("User not found");
    }
    //offload the function for different function(helper function)-userSchema
    const isPasswordMatched = await user.isPasswordValid(password);
    if(!isPasswordMatched){
      throw new Error("Invalid password");
    }else{
      //create a jwt token
      const token = await user.getjwt();
      //add token to cookie and send the response to the user
      res.cookie("token", token, {expires: new Date(Date.now() + 86400000), httpOnly: true});
      res.send(user);
    }

  }catch(err){
    res.status(400).send("ERROR:" + err.message);
  }
});

//logout api
authRouter.post("/logout", (req, res)=>{
   // const cookies = res.clearCookie("token");
   res.cookie("token", null, {expires: new Date(Date.now()), httpOnly: true});
    res.send("Logout successful");
})

module.exports = authRouter;
