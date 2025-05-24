const express = require("express");
const profileRouter = express.Router();
const userAuth = require("../middlewares/auth");
const {validateEditProfileData} = require("../utils/validation");
const {validatePassword} = require("../utils/validation");
const bcrypt = require("bcrypt");



//profile  page
profileRouter.get("/profile/view", userAuth, async(req,res)=>{
  try{
  const user =req.user;
  res.send(user);
  } catch(err){
    res.status(400).send("ERROR:" + err.message);
  }
});
//profile edit api
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      return res.status(400).json({ error: "Invalid data" });
    }

    const loggedinUser = req.user;
    Object.keys(req.body).forEach((key) => {
      loggedinUser[key] = req.body[key];
    });

    await loggedinUser.save();
    res.status(200).json(loggedinUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// profile update password api
profileRouter.patch("/profile/password", userAuth, async(req, res)=>{
  try{
    //sanitize the password before updating
    validatePassword(req);
    const newPasswordHash = await bcrypt.hash(req.body.password, 10);
      req.user.password = newPasswordHash;
     await req.user.save();
     res.send("Password updated successfully");

  }catch(err){
    res.status(400).send("ERROR:" + err.message);
  }

})

module.exports = profileRouter;
