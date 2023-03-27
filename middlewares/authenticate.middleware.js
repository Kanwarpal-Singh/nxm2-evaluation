const jwt = require("jsonwebtoken");
const redis = require("redis")
require("dotenv").config()
const redisClient = redis.createClient(process.env.REDIS_URL)

const authentication = (req,res,next)=>{
    const token = req.headers.authorization
    if(!token){
        return res.status(401).json({message:"No Token!"})
    }
    redisClient.get("blacklist:" +token,(err,decoded)=>{
        if(err){
            logger.error(err)
            return res.status(500).json({message:"server error"})
        }else if (decoded===true){
            logger.info(`Token ${token} is blacklisted`)
            return res.status(401).json({message:"Token is blacklisted"})
        }else{
            if(token){
                jwt.verify(token,"masai",(err,decoded)=>{
                    if(decoded){
                        req.body.user = decoded.userID;
                        next()
                    }else{
                        res.send("Please Login First!")
                    }
                })
            }else{
                res.send("Please login First!")
            }
        }
    })
}
module.exports = {authentication}