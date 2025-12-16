import express from 'express';
import cors from 'cors';
import { db } from './config/index';


const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

app.get('/health', async (_req, res) => {
  try {
    await db.execute('select 1');
    res.json({ status: "ok" });
  } catch (err) {
    res.status(500).json({ status: 'db not ready' });
  }
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
