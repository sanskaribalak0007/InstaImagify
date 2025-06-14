// import express from 'express'
// import cors from 'cors'
// import 'dotenv/config'

// import connectDB from './config/mongodb.js'
// import userRouter from './routes/userRoutes.js'
// import imageRouter from './routes/imageRoutes.js'

// const PORT = process.env.PORT || 4000
// const app = express()

// const startServer = async () => {
//   try{
    
//   }
// }

// app.use(express.json());
// app.use(cors());
// await connectDB()

// app.use('/api/user',userRouter)
// app.use('/api/image',imageRouter)
// app.get("/",(req,res)=>{
//   res.send("Hello World!? ")
// })

// app.listen(PORT,()=>(
//   console.log(`Server is running on port ${PORT}`)
// ))
import express from 'express'
import cors from 'cors'
import 'dotenv/config'

import connectDB from './config/mongodb.js'
import userRouter from './routes/userRoutes.js'
import imageRouter from './routes/imageRoutes.js'

const PORT = process.env.PORT || 4000
const app = express()

app.use(express.json())
app.use(cors())

// ✅ wrap inside async function
const startServer = async () => {
  try {
    await connectDB()
    console.log("✅ MongoDB connected")

    app.use('/api/user', userRouter)
    app.use('/api/image', imageRouter)
    app.get("/", (req, res) => {
      res.send("Hello World!?")
    })

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
    })

  } catch (err) {
    console.error("❌ Error starting server:", err)
  }
}

startServer()
