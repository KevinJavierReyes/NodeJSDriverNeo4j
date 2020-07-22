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

    getPropertiesHTML(){
        let str_pro = ''
        for(let key in this.properties){
            str_pro += `<strong>${key}:</strong> ${this.properties[key]}<br>`
        }
        return str_pro
    }

    getObjectVis(){
        return {
            id: this.identity,
            label: this.label,
            group: this.label,
            title: this.getPropertiesHTML()
        }
    }

    getId(){
        return this.identity
    }
}

class Edge{
    constructor(edge){
        this.identity = edge.identity.low
        this.node_from = edge.start.low
        this.node_to = edge.end.low
        this.label = edge.type
        this.properties = edge.properties
        console.log(edge)
    }

    getObjectVis(){
        return {
            from: this.node_from,
            to: this.node_to,
            // label: this.label,
            title: this.getPropertiesHTML()
        }
    }

    getPropertiesHTML(){
        let str_pro = ''
        for(let key in this.properties){
            str_pro += `<strong>${key}:</strong> ${this.properties[key]}<br>`
        }
        return str_pro
    }

    getIdDirection(){
        return this.node_from + "-" + this.node_to
    }

    getId(){
        return this.identity
    }
}

async function runCypherToNetwork(start=null, end=null){
    let edges = []
    let nodes = []
    const session = driver.session()
    try {
        let query = 'match (e:Employee)-[c:CONTACT_WITH]->(e2:Employee) return e,c,e2'
        if(start && end){
            query = `match (e:Employee)-[c:CONTACT_WITH]->(e2:Employee) 
            where c.contact_start > datetime('${start}') and 
            c.contact_end < datetime('${end}') return e,c,e2`
        }
        const result = await session.run(query, {})
        const history_nodes = {}
        const history_edges = {}
        for(let record of result.records){
            let els = record._fields
            for(let el of els.splice(0,10)){
                if(isRelationship(el)){
                    let edge = new Edge(el)
                    edges.push(edge.getObjectVis())
                }
                else{
                    let node = new Node(el)
                    if(!history_nodes[node.getId()]){
                        history_nodes[node.getId()] = node
                        nodes.push(node.getObjectVis())
                    }
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