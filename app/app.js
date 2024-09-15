import axios from 'axios';
import express from 'express';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/api/ping', (req, res) => {
    res.send('ping');
});

app.get('/api/dictionary/:word', async (req, res) => {
    try{
        const word = req.params.word;
        const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        res.send(response.data);
    }catch(error){
        res.status(404).send('Word not found');
    }
});

app.get('/api/spaceflight_news', (req, res) => {
    res.send('Spaceflight news');
});

app.get('/api/quote', (req, res) => {
    res.send('Quote');
});

const PORT = 3000

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});