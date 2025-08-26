require('dotenv').config()
const express = require('express')

const app = express()
const port = process.env.PORT
app.get('/', (req, res) => {
  res.send('Hello World!')
})
 
app.get("/chat",(req,res)=>{
    res.send("<h1>hello this is my new tab </h1>")
})
app.get("/login",(req,res)=>{
    res.send("<p>hello this is a para </h3>")

})
app.get("/chai",(req,res)=>{
    res.send("heello this is new para at chai ")
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
