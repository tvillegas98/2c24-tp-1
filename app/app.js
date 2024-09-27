
import express from 'express';
import https from 'https';
//import { createClient } from 'redis';

import api_router from './routers/api.router.js';
import apiv2_router from './routers/apiv2.router.js';

// const client = createClient({
//     url: 'redis://redis:6379'
//   });

//client.on('error', err => console.log('Redis Client Error', err));

//await client.connect();

const app = express();

const agent = new https.Agent({
    rejectUnauthorized: false,
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));


//endpoints sin el uso de redis
app.use("/api",api_router);

//endpoints con el uso de redis
app.use("/apiv2",apiv2_router);


const PORT = 3000

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});

// await client.set('key', 'value');
// const value = await client.get('key');
// console.log(value)