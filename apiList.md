# DevTinder APIs

## authRouter
-post /signup
-post /login
-post /logout

## profileRouter
-GET /profile/view
-PATCH /profile/edit
-PATCH /profile/password

## connectionRequestRouter
-POST /request/send/interested/:toUserId
-POST /request/send/ignored/:userId
-POST /request/review/accepted/:requestId
-POST /request/review/rejected/:requestId

## userRouter
-GET /user/connections
-GET /user/request
-GET /feed - gets you the profiles of other users on the platform

* status - ignored, accepted, rejected, interested