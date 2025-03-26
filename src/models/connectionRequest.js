const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
    {
        fromUserId:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        status: {
        type: String,

            enum: {
                values:['ignored', 'accepted', 'rejected', 'interested', 'pending'],
                message: '{VALUE} is not supported'
            },
           
        }

    },
    {
        timestamps: true
    }
);
//campound index
connectionRequestSchema.index({fromUserId: 1, toUserId: 1}, {unique: true});
//validate that a user cannot send a connection request to themselves 
connectionRequestSchema.pre("save", function(next){
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUseId)){
        throw new Error("You cannot send a connection request to yourself");
    }
    next();
})
const ConnectionRequestModel = mongoose.model("ConnectionRequest", connectionRequestSchema);
module.exports = ConnectionRequestModel;
