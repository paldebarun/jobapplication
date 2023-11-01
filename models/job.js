const mongoose=require('mongoose');
const nodemailer=require('nodemailer');

const Job=new mongoose.Schema({
    fullName:{
        type:String,
        require:true
      },
  
      phoneNumber:{
        type:String
      },
      streetAddress:{
        type:String
      },
      jobTitle:{
        type:String
      },
      email:{
        type:String
      }
     


});






module.exports=mongoose.model("Job",Job);