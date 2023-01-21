const express = require("express");
const app = express();
require("dotenv").config();
const cors = require('cors')
const {UserRouter} = require("./Routes/user.router")
const {connection} = require("./Config/db")


app.use(express.json())
app.use(cors({
    origin:"*"
}))

app.get("/", (req, res)=>{
    res.send({"msg":`Hello there, we are listening you at port ${process.env.PORT}`})
})

app.use("/users", UserRouter)

app.use("/calculate", async(req, res)=>{
   try{
    let {P, i, n} = req.body
    i = i/100
    
    let F = P * ((((1+i)**n)-1) / (i))

    res.send({"ans": {

        A : Math.floor(P * n),
        I : Math.floor(F - (P * n)),
        M : Math.floor(F)
    }})
   }catch (err){
    console.log(err)
    res.send({"err": "Something went wrong"})
   }
})






app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("Connect to db while listening at port", process.env.PORT);
  } catch (err) {
    console.log("Error in the connection");
    console.log(err);
  }
});
