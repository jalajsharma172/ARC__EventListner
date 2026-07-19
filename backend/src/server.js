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

// Uptime Monitering
app.use('/', healthRoute);

// YAML Operations
app.use('/', yamlRoute);

// app.use('/', priceAlertsRoute);

// app.use('/', workflowsRoute);
// app.use('/', functionsRoute);// calling any funcation(int)
// app.use('/', statusRoute);




app.listen(port, () => {
    console.log(`I'm listening on port ${port}`);
});