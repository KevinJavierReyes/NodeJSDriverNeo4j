const express = require("express")
const app = express()
const bodyParser  = require("body-parser")
const { PORT, APP_NAME } = require("./config")
const { runCypherToNetwork } = require("./neo4j")
const exphbs = require("express-handlebars")
const path = require("path")

app.engine("handlebars", exphbs.create({}).engine)

app.set("view engine", "handlebars")

app.get("/",async (req, res)=>{
    res.render("partial_vis", { APP_NAME })
})

app.get("/api/v1/data",async (req, res)=>{
    let query = req.query
    if(query.start && query.end){
        let data = await runCypherToNetwork(query.start, query.end)
        res.json(data)
    }
    else{
        let data = await runCypherToNetwork()
        res.json(data)
    }
})

app.listen(PORT || 3000, ()=>{
    console.log(`Server listen on ${PORT}`)
})