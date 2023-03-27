
const reteLimit = require("express-rate-limit")

const limiter = reteLimit({
    windowMs : 3*60*1000,
    max:1,
    message:"Too many requests, please try again later"
})
module.exports = {ratelimit}