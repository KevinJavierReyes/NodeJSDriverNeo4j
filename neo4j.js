const neo4j = require("neo4j-driver")
const { NEO4J_USER, NEO4J_PASSWORD, NEO4J_URI_BOLD } = require("./config")
const driver = neo4j.driver(NEO4J_URI_BOLD, neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD))

function isRelationship(obj){
    if(obj.start && obj.end)
        return true
    else
        return false
}

class Node{
    constructor(node){
        this.identity = node.identity.low
        this.label = node.labels.join(" - ")
        this.properties = node.properties
    }

    getObjectVis(){
        return {
            id: this.identity,
            label: this.label,
            group: this.label
        }
    }
}

class Edge{
    constructor(edge){
        this.node_from = edge.start.low
        this.node_to = edge.end.low
    }

    getObjectVis(){
        return {
            from: this.node_from,
            to: this.node_to
        }
    }
}

async function runCypherToNetwork (){
    let edges = []
    let nodes = []
    const session = driver.session()
    try {
        const result = await session.run('MATCH (p:Place)<-[r:VISITS]-(p2:Person) return p,r,p2', {})
        for(let record of result.records){
            let els = record._fields
            for(let el of els){
                if(isRelationship(el)){
                    let edge = new Edge(el)
                    edges.push(edge.getObjectVis())
                }
                else{
                    let node = new Node(el)
                    nodes.push(node.getObjectVis())
                }
            }
        }
    } finally {
        await session.close()
    }
    return {
        edges,
        nodes
    }
    
}

module.exports = {
    runCypherToNetwork
}