//import neccessary modules
import {Section} from '../models/Section.model.js'
import {SubSection} from '../models/Subsection.model.js'
import {uploadImageToCloudinary} from '../utility/imageUploader.js'
import {asyncHandler} from '../utility/asyncHandler.js'
import {ApiError} from '../utility/ApiError.js'
import {ApiResponse} from '../utility/ApiResponse.js'


// create new subsection for give id 

const createSubSection = asyncHandler(async(req,res)=>{
    // algo
    // take input as sectionId, title , description
    const {sectionId , title, description } = req.body;
    // take video from files
    const {video} = req.files.video;
    // make validation of data obtained
    // ?? below line can have error check it structure of writing is different
     [sectionId, title, description,video].select((element) =>{if(!element){
        throw new ApiError(400,"All fields are required")
     } } )
    // upload image to cloudinary  take response in variable
    const uploadDetails = await uploadImagetoCloudinary(
        video,
        process.env.FOLDER_NAME
    )
    // create subsection 
    const NewsubSection = await SubSection.create({
        title: title,
        timeDuration: `${uploadDetails.duration}`,
        description: description,
        videoUrl: uploadDetails.secure_url,
    })
    // section update with subsectionid 
    const updatedSection = await Section.findByIdAndUpdate(
        sectionId,
        {
            $push:{
                subSection: NewsubSection._id,
            }
        },
        {new: true}
    ).populate({
        path: "subSection"
    })
    // return response
    return res.status(200).json(
        new ApiResponse(200,updatedSection,"subsection created successfully")
    )

})


const updateSubSection = asyncHandler(async(req,res)=>{
       // algo
       // get req.body data : sectionId, subSectionId, title, description
       const {sectionId, subSectionId, title, description} = req.body;
       // find subsection
       const subSection = await SubSection.findById(subSectionId);
       if(!subSection){
        throw new ApiError(404, "SubSection not found")
       }
       // if title is  not undefined 
       if(title !== undefined){
        subSection.title = title;
       }
     
       //  if description not undefined then allocate description in it
       if(description !== undefined){
        subSection.description = description;
       }
       // if req.files available and video is not undefined then get video and store
       if(req.files && (req.files?.video) !== undefined){
        const video = req.files.video;
        const uploadVideo  = await uploadImagetoCloudinary(
            video,
            process.env.FOLDER_NAME
        )
        // cloundiry and add videourl and timeDuration
        subSection.videoUrl = uploadVideo.secure_url
        subSection.timeDuration = `${uploadVideo.duration}`
         
       }
       
       // subsection.save
        await subSection.save();
       // updated section populate
       const updatedSection = await Section.findById(sectionId).populate(
        "subSection"
       ).exec()
       console.log("updated Section",updateSubSection)
       // return response
       return res.status(200).json(
        new ApiResponse(200, updatedSection,"SubSection Updated successfully")
       )

})


const deleteSubSection = asyncHandler(async(req,res)=>{
    // take subsectionid and sectionid 
    const {subSectionId, sectionId} = req.body;
    // find sectionid and update it by pulling subsectionid
     await Section.findByIdAndUpdate(
        sectionId,
        {
           $pull:{
              subSection: subSectionId,
           }
        },

     )
    // now findbyIdand delete subSection
    const subSection = await SubSection.findByIdAndDelete({_id: subSectionId})
    // if !subsection then return subsection not found 
    if(!subSection){
        throw new ApiError(404, "SubSection not Found")
    }
    // find updated section with populated subSection 
    const updatedSection = await Section.findById({_id:sectionId})
    .populate("subSection").exec();
    // return success
    return res.status(200).json(
        new ApiResponse(200, updatedSection,"SubSection deleted Successfully")
    )
})


export {createSubSection, updateSubSection, deleteSubSection}


