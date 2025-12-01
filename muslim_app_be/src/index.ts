import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

const app = express();
const port = process.env.PORT || 3000;
dotenv.config();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World');
  console.log('Response Sent');
});

app.listen(port, () => {
  console.log(`APP Running on Port ${port}`);
});
