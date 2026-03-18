import express from "express";
import route from "./routes/route.js";
import db from "./configs/db.js";
import { initDb } from "./configs/initDb.js";

const app = express();
const port = 3000;

initDb(db);

app.use(express.json());

route(app);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});