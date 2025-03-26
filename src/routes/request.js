const express = require("express");
const requestRouter = express.Router();
const userAuth = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user")

requestRouter.post("/request/send/:status/:toUserId", userAuth, async(req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const allowedStatus = ['ignored', 'interested'];
    if(!allowedStatus.includes(status)){
      return res.status(400).json({message: "Invalid status"});
    }
   const toUser = await User.findById(toUserId);
   if(!toUser){
      return res.status(404).json({message: "User not found"});
   }

    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or:[
           {fromUserId, toUserId},
           {
              fromUserId: toUserId,
              toUserId: fromUserId 
           }
      ]} );

      if(existingConnectionRequest){
        return res.status(400).json({message: "Connection request already exists or has been accepted"});
      }

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status
    });

    const data = await connectionRequest.save();
    res.json({
      message: req.user.firstName +" has " + status + " to " + toUser.firstName,
      data: data
    })

  } catch (err) {
    console.log(err);
    res.status(500).json({message: "Internal server error"});
  }
});


module.exports = requestRouter;