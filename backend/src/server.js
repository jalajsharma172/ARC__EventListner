import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';


import priceAlertsRoute from './route/priceAlerts.js';
import healthRoute from './route/health.js';
import workflowsRoute from './route/workflows.js';
import functionsRoute from './route/functions.js';
import statusRoute from './route/status.js';
import yamlRoute from './route/yaml.js';

dotenv.config({
    path: '../.env'
});
const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cors({
    origin: "*"
}));

app.use('/', priceAlertsRoute);
app.use('/', healthRoute);
app.use('/', workflowsRoute);
app.use('/', functionsRoute);
app.use('/', statusRoute);
app.use('/', yamlRoute);



app.listen(port, () => {
    console.log(`I'm listening on port ${port}`);
});