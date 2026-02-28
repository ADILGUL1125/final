import express from "express"
import chatroutes from "./routes/chat.js"
import { dbconnect } from "./config/db.js"
import userroute from "./routes/user.js"
import "dotenv/config"
import cookieparser from "cookie-parser"
import cors from "cors"
const app = express()
const port = 3000
app.use(express.json())
app.use(cookieparser())
app.use(cors())

app.use('/api',chatroutes)
app.use('/api',userroute)
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  dbconnect()
})
