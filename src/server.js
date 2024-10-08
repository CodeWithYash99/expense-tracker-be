const express = require("express");

const app = express();

const port = 3001;

app.use(express.json());

app.get('/', function(req, res) {
    res.send("Hello, World!");
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
