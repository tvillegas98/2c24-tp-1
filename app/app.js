
import express from 'express';



import api_router from './routers/api.router.js';
import apiv2_router from './routers/apiv2.router.js';
import apiv3_router from './routers/apiv3.router.js';
import apiv4_router from './routers/apiv4.router.js';

const app = express();


app.use(express.json());
app.use(express.urlencoded({extended: true}));


//endpoints sin el uso de redis
app.use("/api",api_router);

//endpoints con el uso de redis
app.use("/api/v2",apiv2_router);

//rate limiter
app.use("/api/v3",apiv3_router);

//rate limiter + redis
app.use("/api/v4",apiv4_router);

const PORT = 3000

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});

