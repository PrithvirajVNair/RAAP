const jwt = require("jsonwebtoken")

const jwtMiddleware = (req,res,next)=>{
    const token = req.headers['authorization'].split(' ')[1]
    try{
        const jwtResponse = jwt.verify(token,process.env.SECRET_KEY)
        req.payload = jwtResponse.email
        next()
    }
    catch (err) {
        res.status(401).json("Please Login")
    }
}
module.exports = jwtMiddleware