import dotenv from 'dotenv'
import { dbConnect } from './db/index.js'
import {app} from './app.js'
dotenv.config({ // dot env configuration 
    path:'./.env'
})

dbConnect().then(()=>{
      app.listen(`${process.env.PORT}` || 4000 ,()=>{
         console.log(`Server started at port ${process.env.PORT}`);
      })

})
.catch((error)=>{
    console.log(`Server can not be started due to ${error}`)
})