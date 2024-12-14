import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
//route
import authRoutes from './routes/auth.Routes.js'
import errorHandleware from './middleware/errorHandleware.js'
dotenv.config()
const app = express()
app.use(express.json())

app.use('/api/v1/auth',authRoutes)

app.use('*',(req,res)=>{
    res.status(404).json({msg:"page not found"})
})
app.use(errorHandleware)

const port = process.env.PORT || 3100
app.listen(port,async (req,res)=>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log('MongoDB connceted');
        console.log(`server is running port ${port}`);
    } catch (error) {
        console.log(error);
        
    }
})