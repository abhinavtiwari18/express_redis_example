const Redis = require("ioredis");
const redisClient = new Redis('redis://localhost:6379');


async function setDataInRedis(id, data){
    await redisClient.set(id, JSON.stringify(data),"EX", 600);
}

async function getDataFromRedis(id){
    let data;
    data = await redisClient.get(id);
    return data;
}

module.exports = {setDataInRedis, getDataFromRedis};

