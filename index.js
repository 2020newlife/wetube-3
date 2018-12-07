const express = require("express");
const app = express();

const PORT = 4000;

function handleListening() {
    console.log(`server on: http://localhost:${PORT}`);
}

function handleHome(req, res) {
    res.send("hello from home");
}

app.get("/", handleHome);

app.listen(PORT, handleListening);