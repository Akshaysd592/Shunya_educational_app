import {v2 as cloudinary} from 'cloudinary';

const uploadImageToCloudinary = (file,folder,height , quality)=>{
    const options = {folder};
    if(height){
        options.height = height;
    }
    if(quality){
        options.quality = quality;
    }

    options.resource_type = "auto";
    console.log("Options",options);
    return cloudinary.uploader.upload(file.tempFilePath,options)

}


export  {uploadImageToCloudinary};