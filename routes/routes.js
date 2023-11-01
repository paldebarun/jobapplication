const express=require("express");
const routes=express.Router();


const {signup,login,createJob,getAllJobs,generateotp,checkOtp,sendEmail}=require('../controllers/handlers');

routes.post("/signup",signup);
routes.post("/login", login);

routes.post('/uploadjob',createJob);
routes.post('/fetchjobs',getAllJobs);

routes.post('/apply',sendEmail);

routes.post('/sendOtp',generateotp);
routes.post('/checkotp',checkOtp);

module.exports=routes;