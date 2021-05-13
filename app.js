const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

// app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);
app.use(express.static(__dirname + "/public"));
app.use(cors("*"));

app.get("/", (req, res) => {
    res.render("index.html");
});

function getRand() {
    let minX = 33.1;
    let maxX = 38.45;
    let minY = 125.06666667;
    let maxY = 131.87222222;
    let coor = [];
    for (let i = 0; i < 1000; i++) {
        const rand1 = Math.random();
        let ranX = minX + (maxX - minX) * rand1;
        const rand2 = Math.random();
        let ranY = minY + (maxY - minY) * rand2;
        coor.push([+ranY, +ranX]);
    }
    return coor;
}
app.get("/coor", (req, res) => {
    res.send(JSON.stringify(getRand()));
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
