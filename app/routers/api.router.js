import axios from 'axios';
import { Router } from 'express';
import StatsD from 'hot-shots';
import https from 'https';
import handle_error from '../handle_error.js';

const router = Router();

const agent = new https.Agent({
    rejectUnauthorized: false,
});

const statsd = new StatsD({
  host: 'graphite',
  port: 8125,
  protocol: 'udp',
  prefix: 'api.'
});


router.get('/ping', (req, res) => {
    res.send('ping');
});

router.get('/dictionary', async (req, res) => {
    try{
        const word = req.query.word;
        const start = process.hrtime.bigint();
        const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const end = process.hrtime.bigint();
        const milliseconds = Number(end - start) / 1e6;
        statsd.timing('request.consume_api_time', milliseconds);
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
        const start = process.hrtime.bigint();
        const response = await axios.get('https://api.spaceflightnewsapi.net/v4/articles/?limit=5');
        const end = process.hrtime.bigint();
        const milliseconds = Number(end - start) / 1e6;
        statsd.timing('request.consume_api_time', milliseconds);
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
        const start = process.hrtime.bigint();
        const response = await axios.get('https://uselessfacts.jsph.pl/api/v2/facts/random');
        const end = process.hrtime.bigint();
        const milliseconds = Number(end - start) / 1e6;
        statsd.timing('request.consume_api_time', milliseconds);
        const content = response.data.text
        res.send({content});
    }catch(error){
        console.log(req.path);
        const response = handle_error(error)
        res.status(response[0]).send(response[1]);
    }
});


export default router;