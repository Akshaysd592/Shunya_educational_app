import express from 'express'
const app = express();
import cors from 'cors'
import cookieParser from 'cookie-parser'

// middlewares to be used 
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser());

// import routes ?
import healthcheckroute from './routes/healthcheck.routes.js'


// routes declaration ?
app.use('/api/v1/healthcheck',healthcheckroute);
export {app};