const { verify } = require("jsonwebtoken");
const { JWT_SECRET } = require("./JWT_SECRET");
const { log } = require("console");
// Middleware to verify JWT token

 function AuthMiddleware(req,res,next){
   try{
    const jwt = req.headers.authorization
    if (!jwt) {
        res.status(401).json({ msg: "You are not logged in" });
        return
     }
     const data =  verify(jwt, JWT_SECRET)
    //@ts-ignore
    req.userId = data.userId
    log("AuthMiddleware",data)
    next()
} catch (error) {
    // Return "Invalid request" if token verification fails
    res.status(400).json({ msg: "Invalid request" });
    return 
  }
}
module.exports = {AuthMiddleware}