require('dotenv').config();
const express=require('express');
const cors=require('cors');
const profileRoutes=require('../routes/profileRoutes');
const { notFoundHandler, errorHandler } = require('../middleware/errorMiddleware');

const app=express();
app.use(cors());
app.use(express.json());
app.get('/',(req,res)=>{
    res.json({message:"Welcome to Github profile Analyzer API",
        success:true,
        endpoints:{
            analyzeProfile:"POST /api/profile/analyze",
            allProfiles:"GET /api/profile",
            singleProfile:"GET /api/profile/:username",
            health:'GET /health'
        }
    });
});
app.get('/health',(req,res)=>{
    res.json({
        status:"OK",
        success:true
    })
})
app.use('/api/profile',profileRoutes);

app.use(notFoundHandler);
app.use(errorHandler);


module.exports=app;
