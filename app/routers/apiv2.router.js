import axios from 'axios';
import { Router } from 'express';
import handle_error from '../handle_error.js';
import { createClient } from 'redis';
import https from 'https';

const router = Router();

const agent = new https.Agent({
    rejectUnauthorized: false,
});


const client = createClient({
    url: 'redis://redis:6379'
});


client.on('error', err => console.log('Redis Client Error', err));

await client.connect();

router.get('/ping', async (req, res) => {
    await client.set("pong", "ping");
    const value = await client.get("pong");
    res.send(value);
});


router.get('/dictionary', async (req, res) => {
    try{
        const word = req.query.word;

        let word_return;
        const word_return_string = await client.get(word);

        if (word_return_string !== null){
            word_return = JSON.parse(word_return_string);
        }else{
            const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            const phonetics = response.data[0].phonetics
            const meanings = response.data[0].meanings
            word_return = {word,phonetics, meanings};
            //La cache se limpia en 60 segundos
            await client.set(word, JSON.stringify(word_return));
        }

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
        let titles;
        
        const titlesString = await client.get("spaceflight_news");

        if (titlesString !== null){
            titles = JSON.parse(titlesString);
        }else{
            titles = []

            const response = await axios.get('https://api.spaceflightnewsapi.net/v4/articles/?limit=5');
            response.data.results.forEach((article) => {
                titles.push(article.title);
            });

            //TTL es de 60 segundos.
            await client.set("spaceflight_news", JSON.stringify(titles));
        }

        res.send(titles);
    }catch(error){
        console.log(req.path);
        const response = handle_error(error)
        res.status(response[0]).send(response[1]);
    }
});

router.get('/quote', async (req, res) => {
    try{
        let random_number = Math.floor(Math.random() * 10);
        random_number = random_number.toString();
        const quoteString = await client.get(random_number);
        let quote;
        if (quoteString !== null){
            quote = JSON.parse(quoteString);
        }else{
            const response = await axios.get('https://uselessfacts.jsph.pl/api/v2/facts/random');
            const content = response.data.text
            quote = {content};
            await client.set(random_number, JSON.stringify(quote));
        }

        res.send(quote);
    }catch(error){
        console.log(req.path);
        const response = handle_error(error)
        res.status(response[0]).send(response[1]);
    }
});

//flush redis db
router.get('/flush', async (req, res) => {
    try{
        await client.flushAll();
        res.send("Flushed");
    }catch(error){
        console.log(req.path);
        const response = handle_error(error)
        res.status(response[0]).send(response[1]);
    }
});

export default router;