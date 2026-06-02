function notFoundHandler(req,res,next){
    const error =new Error(`Route not found - ${req.originalUrl}`);
    error.statusCode=404;
    next(error);
}

function errorHandler(err,req,res,next){
    const statusCode =
        err.statusCode || err.status || err.response?.status || 500;
    res.status(statusCode).json({
        message:err.message || "Internal Server Error",
        success:false,
        statusCode
    });
}

module.exports={
    notFoundHandler,
    errorHandler
};