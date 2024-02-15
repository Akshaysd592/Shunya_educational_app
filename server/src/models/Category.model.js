import mongoose from 'mongoose'


const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    courses:[ // multiple courses in category
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Course",
        },

    ],
});


// export Category model
export const Category  = mongoose.model("Category", categorySchema);