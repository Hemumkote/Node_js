const express = require("express");

const app = express(); // instance of an express js application
const PORT = 3000;

app.listen(PORT, () => {
  console.log(
    "server is running on the port 3000 oprn in http://localhost:3000 oko"
  );
}); // now our app is listening thru that port ,and the Callback is called only on server running

app.get("/", (req, res) => {
  res.send("The app is running  ");
});

app.use("/goola", (req, res) => {
  res.send("The app is running  ijijij ");
});
