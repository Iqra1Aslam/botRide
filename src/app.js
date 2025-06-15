import express from 'express'
import cors from 'cors'
import chatRoute from './routes/chat.routes.js';  



const app = express()

app.use(express.json({ limit: '1mb' }))
app.use(cors({
//     origin: ['http://localhost:5173/', 'http://localhost:3000/']
}))


// ✅ must come after middlewares
app.use('/api', chatRoute);

app.get("/", (req, res) => {
    res.send("Welcome to the API!");
  })
  




export { app }

