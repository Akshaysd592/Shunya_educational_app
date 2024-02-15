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

export const Section = mongoose.model("Section",SectionSchema);