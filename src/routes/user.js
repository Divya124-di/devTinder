const express = require("express");
const userRouter = express.Router();
const userAuth = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");

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
})

module.exports = userRouter;