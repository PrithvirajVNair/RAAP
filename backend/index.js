require("dotenv").config()
const express = require("express")
const cors = require("cors")
require('./config/connection')

const server = express()

server.use(cors())
server.use(express.json())

PORT = 3000 || process.env.PORT

server.listen(PORT,()=>{
    console.log(`Server Running in PORT : ${PORT}`);
})

server.get("/",(req,res)=>{
    res.status(200).send("<h1>Server is Running</h1>")
})