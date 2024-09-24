import axios from 'axios';
import express from 'express';
import https from 'https';

const app = express();

const agent = new https.Agent({
    rejectUnauthorized: false,
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/api/ping', (req, res) => {
    res.send('ping');
});

app.get('/api/dictionary', async (req, res) => {
    try{
        const word = req.query.word;
        const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const phonetics = response.data[0].phonetics
        const meanings = response.data[0].meanings
        res.send({word,phonetics, meanings});
    }catch(error){
        res.status(404).send('Word not found');
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
        res.status(404).send('News not found');
    }
});

app.get('/api/quote', async (req, res) => {
    try{
        const response = await axios.get('https://api.quotable.io/random', { httpsAgent: agent });
        const content = response.data.content;
        const author = response.data.author;
        res.send({content, author});
    }catch(error){
        res.status(404).send('Quote not found');
    }
});

const PORT = 3000

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});