import express from 'express';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const app = express();


app.get('/', (req, res) => {
  res.status(200).send('For Uptime to hit');
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`I'm listnerning man http://localhost:${PORT}`);
});