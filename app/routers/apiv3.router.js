import axios from 'axios';
import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';

import https from 'https';
import handle_error from '../handle_error.js';

// Configura el rate limiter
const limiter = rateLimit({
    windowMs: 1000, // 1 segundo
    max: 3, // máximo de 5 solicitudes por IP
    message: 'Too many requests from this IP, please try again after 1 second.'
});

const router = Router();

router.use(limiter);

const agent = new https.Agent({
    rejectUnauthorized: false,
});


router.get('/ping', (req, res) => {
    res.send('ping');
});

router.get('/dictionary', async (req, res) => {
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

router.get('/spaceflight_news', async (req, res) => {
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

router.get('/quote', async (req, res) => {
    try{
        const response = await axios.get('https://uselessfacts.jsph.pl/api/v2/facts/random');
        const content = response.data.text
        res.send({content});
    }catch(error){
        console.log(req.path);
        const response = handle_error(error)
        res.status(response[0]).send(response[1]);
    }
});


export default router;