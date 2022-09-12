import * as express from "express";

const app = express();

// get => attaches cb for GET request for "/" calls, ie. the cb runs when "/" is requested
app.get("/", (req, res) => {
  res.send("Hello world !");
});

app.listen(5000);
