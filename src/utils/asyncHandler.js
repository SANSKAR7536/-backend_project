const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}


export { asyncHandler }
// using the promise verion to connect it //

/*const asyncHandler=(requesthandler)=async(err,req,res,next)=>{
    try {
        
    } catch (error)
    { res.send(error.code||500).json({
        succes:false,
        message:err.message
    });  
    }
}*/


