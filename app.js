const express = require('express')
const redis = require('redis')
const axios = require('axios')

const app = express()

const PORT = process.env.PORT || 3000
const REDIS_PORT = process.env.PORT || 6379
const client = redis.createClient({url: 'redis://redis:6379'})
client.connect()

client.on('connect', () => console.log(`Redis is connected on port ${REDIS_PORT}`))
client.on('error', (error) => console.log(error))

app.get('/api/v1/users/:username', async (req,res)=>{
  try{
    const username = req.params.username

    const redisUsername = await client.get(username);

    if(redisUsername){
      return res.status(200).send({
        message: `Retrived ${username} data from the caache`,
        users: JSON.parse(redisUsername)
      })
    }
    else{
      const api = await axios.get(`https://jsonplaceholder.typicode.com/users/?username=${username}`)
      client.setEx(username, 1440, JSON.stringify(api.data))
      return res.status(200).send({
        message: `Retrived ${username} data from the server `,
        users: api.data
      })
    }
  }
  catch(error){
    console.log(error)
  }
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

module.exports = app