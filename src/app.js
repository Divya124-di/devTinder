const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

require("dotenv").config();
app.use(express.json());

app.post("/signup", async (req, res) => {
  
  // Creating a new instance of the User model
  const user = new User(req.body);

   try {
    await user.save();
    res.send("User Added successfully!");
  } catch (err) {
    res.status(400).send("Error saving the user:" + err.message);
  }
});

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

