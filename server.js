const express = require("express")
const app = express()
const bodyParser  = require("body-parser")
const { PORT } = require("./config")
const { runCypherToNetwork } = require("./neo4j")
const hbs = require("handlebars")

app.get("/",async (req, res)=>{
    
})

app.get("/api/v1/data",async (req, res)=>{
    let data = await runCypherToNetwork()
    res.json(data)  
})

app.listen(PORT || 3000, ()=>{
    console.log(`Server listen on ${PORT}`)
})