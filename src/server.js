import express from "express";
import route from "./routes/route.js";

const app = express();
const port = 3000;


app.get('/', (req, res) => {
    res.send('Hello World!');
});

route(app);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});