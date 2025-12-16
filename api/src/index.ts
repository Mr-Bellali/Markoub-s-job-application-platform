import express, {type Express} from "express";

// import routes from "./routes";
import { config } from 'dotenv';
config();
import cors from 'cors';

const app: Express = express()
const PORT = 8080;

app.use(cors());
app.use(express.json());

// app.use("/api/v1", routes)

app.listen(PORT, () => {
    console.log(`Access API on http://localhost:${PORT}/api/v0`)
})

export default app