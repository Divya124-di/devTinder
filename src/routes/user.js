const express = require("express");
const userRouter = express.Router();
const userAuth = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const UserModel = require("../models/user");
const { set } = require("mongoose");

userRouter.get("/user/request/received", userAuth, async(req, res) => {
    try{
        const loggedInUser = req.user;
const connectionRequest = await ConnectionRequestModel.find({
    toUserId : loggedInUser._id,
    status : "interested"
}).populate("fromUserId", ["firstName", "lastName", "emailId"]); 

res.json({message: "data fetched", data : connectionRequest});

    }catch(err){
        res.status(400).send("ERROR", err.message);
    }
});

userRouter.get("/user/connections", userAuth, async(req, res) => {
    try{
        // loggedInuser => puja  -- want to know about all connections of puja
        // divya => puja => accepted
        // puja => john => accepted

        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequestModel.find({
          $or: [
            { fromUserId: loggedInUser._id, status: "accepted" },
            { toUserId: loggedInUser._id, status: "accepted" },
          ],
        })
          .populate("fromUserId", ["firstName", "lastName", "emailId"])
          .populate("toUserId", ["firstName", "lastName", "emailId"]);
        // connectionRequest = [{fromUserId: divya, toUserId: puja}, {fromUserId: puja, toUserId: john}]
        // fromUserId => divya, toUserId => puja    
        // fromUserId => puja, toUserId => john
        // loggedInUser => puja
       const data = connectionRequest.map((request) =>
         request.fromUserId._id.toString() === loggedInUser._id.toString()
           ? request.toUserId
           : request.fromUserId
       );
        res.json({message: "data fetched", data : data});
    }catch(err){
        res.status(400).send({message: err.message});
    }
});

userRouter.get("/feed", userAuth, async(req, res) => {

const page = parseInt(req.query.page) || 1; // default to page 1 if not provided
const limit = parseInt(req.query.limit) || 10; // default to 10 items per page if not provided
const skip = (page - 1) * limit; // calculate the number of items to skip

  try{
//  loggedInUser => puja  -- user should see all the users profile except 
// 0. his own profile
// 1. his connections(accepted profiles)
// 2.ignored profiles(rejected profiles)
// 3. interested profiles

const loggedInUser = req.user;
const connectionRequest = await ConnectionRequestModel.find({
  $or: [
    { fromUserId: loggedInUser._id },
    { toUserId: loggedInUser._id },
  
  ],
}).select("fromUserId toUserId");

const hideUserIdsfromFeed = new Set();

connectionRequest.forEach((request) => {
hideUserIdsfromFeed.add(request.fromUserId.toString());
hideUserIdsfromFeed.add(request.toUserId.toString());
});

const user = await UserModel.find({
  $and :[
      {_id : {$nin : Array.from(hideUserIdsfromFeed)}}, 
     { _id : { $ne : loggedInUser._id}}

  ]
}).select(["firstName", "lastName", "emailId"]).skip(skip).limit(limit);

res.send(user);

  }catch(err){
    res.status(400).send({message : err.message});
  }
})

module.exports = userRouter;