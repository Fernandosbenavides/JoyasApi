import express from 'express';
import joyasRoutes from './routes/joyasRoutes.js';
import cors from 'cors';
import { serverLog } from './middlewares/ServerLogin.js';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(serverLog);

app.use('/', joyasRoutes);

app.listen(port, () => {
  console.log(`SERVER UP!!! ${port}.`);
});