const express = require("express");
const app = express();
const port = "8085";


    app.get("/", (req, res) => {
        res.send("Hola pa");
    });




    app.listen(port)
