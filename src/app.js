const express = require("express");
const { adminAuth } = require("./middleware/auth");

const app = express(); // instance of an express js application
const PORT = 3000;

app.listen(PORT, () => {
  console.log(
    "server is running on the port 3000 oprn in http://localhost:3000 oko"
  );
}); // now our app is listening thru that port ,and the Callback is called only on server running

app.use('/admin',adminAuth)

app.get("/admin/getUsers",(req,res)=>{
  console.log("get users")
  res.send('sending the users data')
})
app.get("/admin/deleteUser",(req,res)=>{
  console.log("del users")
  res.send('deleting the users data')
})
