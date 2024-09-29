
import express from 'express';



import api_router from './routers/api.router.js';
import apiv2_router from './routers/apiv2.router.js';

const app = express();


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

