const express = require('express')
const { MongoClient} = require('mongodb')
const cors = require('cors')

const uri = process.env.MONGODB_URI
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let app = express()
app.use(cors())

async function getDocuments(collectionName) {

    try {
        await client.connect();
        const database = client.db(process.env.MONGODB_DATABASE_1);
        const collection = database.collection(collectionName);
        const user = collection.find().project({_id:0})
        return await user.toArray()
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

async function getStats(collectionName) {

    try {
        await client.connect();
        const database = client.db(process.env.MONGODB_DATABASE_2);
        const collection = database.collection(collectionName);
        const user = collection.find().project({_id:0})
        return await user.toArray()
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

app.get("/team/:team_name",async(req,res) => {
    const data = await getDocuments(req.params.team_name.toLowerCase()).catch(console.log)
    res.json(data)
})

app.get("/teamlogos",async(req,res) => {
    const data = await getDocuments('Team_Logos').catch(console.log)
    res.json(data)
})

app.get("/matches-schedule",async(req,res) => {
    const data = await getDocuments('Matches_Schedule').catch(console.log)
    res.json(data)
})

app.get("/stats/:stats_name",async(req,res) => {
    const data = await getStats(req.params.stats_name).catch(console.log)
    res.json(data)
})

app.get("/stats/all-time/:stats_name",async(req,res) => {
    const data = await getStats('All_Time_' + req.params.stats_name).catch(console.log)
    res.json(data)
})

app.listen(8090,() => console.log("Express Server is Running ...."))
