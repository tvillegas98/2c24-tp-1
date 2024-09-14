import express from 'express';
import axios from 'axios';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/ping', (req, res) => {
    res.send('ping');
});

app.get('/dictionary/:word', async (req, res) => {
    try{
        const word = req.params.word;
        const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        res.send(response.data);
    }catch(error){
        res.status(404).send('Word not found');
    }
});

app.get('/spaceflight_news', (req, res) => {
    res.send('Spaceflight news');
});

app.get('/quote', (req, res) => {
    res.send('Quote');
});

const PORT = 8080

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});