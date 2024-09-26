import axios from 'axios';
import express from 'express';
import https from 'https';
import { v4 as uuid4 } from 'uuid';

const API_ID = uuid4();
const app = express();

const agent = new https.Agent({
    rejectUnauthorized: false,
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/api/ping', (req, res) => {
    res.send({API_ID: API_ID});
});

function handle_error(error) {
    if (error.response) {
        console.log(error.response.statusText);
        console.log(error.response.status);
        return [error.response.status, error.response.statusText]
    } else if (error.request) {
        console.log(error.message);
        return [503, "API Connection Error"]
    } else {
        console.log('Error', error.message);
        return [500, "Server Error"]
    }
}

app.get('/api/dictionary', async (req, res) => {
    try{
        const word = req.query.word;
        const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const phonetics = response.data[0].phonetics
        const meanings = response.data[0].meanings
        res.send({word,phonetics, meanings});
    }catch(error){
        console.log(req.path);
        console.log(req.query.word);
        const response = handle_error(error)
        res.status(response[0]).send(response[1]);
    }
});

app.get('/api/spaceflight_news', async (req, res) => {
    try{
        const response = await axios.get('https://api.spaceflightnewsapi.net/v4/articles/?limit=5');
        const titles = []
        response.data.results.forEach((article) => {
            titles.push(article.title);
        });
        res.send(titles);
    }catch(error){
        console.log(req.path);
        const response = handle_error(error)
        res.status(response[0]).send(response[1]);
    }
});

app.get('/api/quote', async (req, res) => {
    try{
        const response = await axios.get('https://api.quotable.io/random', { httpsAgent: agent });
        const content = response.data.content;
        const author = response.data.author;
        res.send({content, author});
    }catch(error){
        console.log(req.path);
        const response = handle_error(error)
        res.status(response[0]).send(response[1]);
    }
});

const PORT = 3000

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
