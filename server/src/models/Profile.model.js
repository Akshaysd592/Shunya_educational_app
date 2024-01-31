import  mongoose from 'mongoose';


const profileSchema = new mongoose.Schema({
    gender:{
        type:String,
    },
    dateOfBirth:{
        type: String,
    },
    about:{
        type:String,
        trim: true,
    },
    constactNumber:{
        type: Number,
        trim: true,
    },
});


// export Profile model
module.exports = mongoose.model("Profile", profileSchema);