const express = require("express");
const profileRouter = express.Router();
const userAuth = require("../middlewares/auth");


//profile page
profileRouter.get("/profile", userAuth, async(req,res)=>{
  try{
  const user =req.user;
  res.send(user.firstName + "is the user");
  } catch(err){
    res.status(400).send("ERROR:" + err.message);
  }
});

module.exports = profileRouter;