


const healthcheck = (req,res)=>{
    try {
         return res.status(200).json({
            success:true,
            message:"Success no error ..."
         })

    } catch (error) {
        console.log("health is not ok need some changes ",error)
    }
}


export {healthcheck};
