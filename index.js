const express = require("express");
const axios = require("axios");
const {getDataFromRedis, setDataInRedis} = require("./config/redis");
const REDIS_KEY = 'user_data_key';

const app = express();
const port = process.env.PORT || 3000;

async function fetchUserData(){
    const userResponse = await axios.get('https://jsonplaceholder.typicode.com/users');
    console.log('Request sent to external API');
    return userResponse.data;
}

async function getUserData(req, res){
    let results;
    let dataFromCache = false;
    try{
        const cachedResults = await getDataFromRedis(REDIS_KEY);
        if (cachedResults) {
            dataFromCache = true;
            results = JSON.parse(cachedResults);
        } else {
            results = await fetchUserData();
            if (results.length == 0) {
                throw 'API returned empty Data';
            }
            await setDataInRedis(REDIS_KEY, results)
        }
        res.send({
            dataFromCache: dataFromCache,
            result: results
        });
    }catch (error) {
        console.error(error);
        res.status(404).send('Data not found');
    }
}

app.get('/users', getUserData);

app.listen(port, () => {
    console.log('Server is up on port ' + port)
});