const express = require("express")
const app = express()
const bodyParser  = require("body-parser")
const { PORT } = require("./config")


app.get("/", (req, res)=>{
    res.send("Todo Ok.")    
})

app.listen(PORT || 3000, ()=>{
    console.log(`Server listen on ${PORT}`)
})