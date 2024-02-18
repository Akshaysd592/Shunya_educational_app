import express from 'express'
const app = express();
import cors from 'cors'
import cookieParser from 'cookie-parser'
import fileUpload from 'express-fileupload'
import cloudinayConnect from './config/cloudinary.config.js';
// if required then import dotenv
import dotenv from 'dotenv';
dotenv.config(
    {
        path:'./.env'
    }
);

// middlewares to be used 
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser());
app.use(
    fileUpload({
        useTempFiles : true,
        tempFileDir : '/tmp/'
    }
    )
)
// connecting  to cloudinary
cloudinayConnect();


// import routes 
import healthcheckRoute from './routes/healthcheck.routes.js'
import userRoutes  from './routes/User.routes.js'


// routes declaration 
app.use('/api/v1/healthcheck',healthcheckRoute);
app.use('/api/v1/auth',userRoutes);
export {app};