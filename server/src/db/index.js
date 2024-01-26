import mongoose from 'mongoose';
import {DB_NAME} from '../constants.js'

const dbConnect = async()=>{
    try {
        const response = await mongoose.connect(`${process.env.DB_URL}/${DB_NAME}`)

        if(dbConnect){
            console.log(`\n Database Connected succesfully at ....${response.connection.host}`);
        }
    } catch (error) {
        console.log("Database not connected ....",error);
        process.exit(1);
        
    }
}

export {dbConnect};