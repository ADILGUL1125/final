import express from "express"
import chatroutes from "./routes/chat.js"
import { dbconnect } from "./config/db.js"
import userroute from "./routes/user.js"
import doctorRoute from "./routes/doctor.js"
import patientRoute from "./routes/patient.js"
import "dotenv/config"
import cookieparser from "cookie-parser"
import cors from "cors"
const app = express()
const port = 3000
app.use(express.json())
app.use(cookieparser())
const corsOptions = {
  origin: "http://localhost:5173",  // sirf is origin ko allow karega
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true  // cookies ya token allow karega
};

app.use(cors(corsOptions))

app.use('/api',chatroutes)
app.use('/api',userroute)
app.use('/api',doctorRoute)
app.use('/api',patientRoute)
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  dbconnect()
})
