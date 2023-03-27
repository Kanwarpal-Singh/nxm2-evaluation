const express = require("express");
require("dotenv").config()
const redis = require("redis")
const rateLimit = require("./middlewares/rateLimit")

const UserModel = require("./model/UserModel")
const userRouter = require("./routes/userRouter")
const connection = require("./config/db")
const {authentication}= require("./middlewares/authenticate.middleware")
const { transports,createLogger,format } = require("winston")
const {combine,timestamp,label,printf} = format;



const port = process.env.PORT

const app = express();
app.use(express.json())



const myFormat = printf(({level,message,label,timestamp})=>{
    return `${timestamp}, ${level}, ${label}, ${message}`
})
const logger = createLogger({
    level:"info",
    format:combine(
        label({
            label:"weather.app"
        }),
        timestamp(),
        myFormat
    ),
    transports:[
        new transports.Console(),
        new transports.File({
            filename:"logs/error.log",
            level:"error"
        }),
        new transports.File({filename:"log/combined.log"})
    ],
})

app.use(authentication)
app.use(rateLimit)
app.use("/users",userRouter)

app.listen(port,async()=>{
    try {
        await connection
        console.log("Connected to the Database")
    } catch (error) {
        console.log(error)
    }
    console.log(`server is running at port ${port}` )
})