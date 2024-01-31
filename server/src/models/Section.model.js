import mongoose from 'mongoose';

const SectionSchema = new mongoose.Schema({
    sectionname:{
        type: String,
    },
    subSection:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"SubSection",
            required:true,
        },
    ],
});

// export Section model

module.exports = mongoose.model("Section",SectionSchema);