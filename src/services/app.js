require('dotenv').config();
const express=require('express');
const cors=require('cors');
const profileRoutes=require('./routes/profileRoutes');

const app=express();
app.use(cors());
app.use(express.json());
app.get('/',(req,res)=>{
    res.json({message:"Welcome to Github profile Analyzer API"});
});

app.use('/api/profile',profileRoutes);
module.exports=app;
