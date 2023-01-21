const jwt = require("jsonwebtoken")


const authenticate = (req, res, next)=>{
    const token = req.headers?.authorization?.split(" ")[1];
    if(token){
        var decoded = jwt.verify(token, 'secret');
      if(decoded){
        const userId = decoded.userId
        req.body.userId = userId
        next()
      }else{
        res.send({"err":"Please Login again"})
      }
    }else{
        res.send({"err":"Please Login again"})
    }
}

module.exports = {authenticate}