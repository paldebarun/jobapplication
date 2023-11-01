const User = require('../models/user');
const bcrypt = require('bcrypt');
const Job =require('../models/job');
require('dotenv').config();
const Otp=require('../models/otp');
const jwt=require('jsonwebtoken')
const nodemailer=require('nodemailer');



exports.signup = async (req, res) => {
    try {
       const { firstName, lastName, email, password,role } = req.body;
       const existingUser = await User.findOne({ email });
 
       if (existingUser) {
          return res.status(400).json(
             {
                success: false,
                message: "user already present"
             }
          );
       }
       let hashedpassword;
 
       try {
          hashedpassword = await bcrypt.hash(password, 10);
 
       }
       catch (error) {
          return res.status(400).json({
             success: false,
             message: "hashing of the password was not successful"
          })
       }
 
       const newUser = await User.create({
          lastName,
          firstName,
          email,
          password: hashedpassword,
          role
 
       });
 
       return res.status(200).json(
          {
             success: true,
             message: "user registered successfully",
          }
       );
 
 
    }
 
    catch (error) {
       console.error();
       return res.status(400).json({
          success: false,
          message: "User can't be registered due to some error"
       });
    }
 
 }


 exports.login = async (req, res) => {

    try {
 
       const { email, password } = req.body;
 
       const findUser = await User.findOne({ email:email });
 
       if (!email || !password) {
          return res.status(400).josn({
             success: false,
             message: "kindly enter the email and password to login"
          });
       }
 
       if (!findUser) {
          return res.status(400).json({
             success: false,
             message: "User is not present kindly signup first"
          })
       }
 
       const payload = {
          email: findUser.email,
          id: findUser._id,
 
       }
 
       if (await bcrypt.compare(password, findUser.password)) {
 
          let token = jwt.sign(payload, process.env.JWT_SECRETE, {
             expiresIn: "2h"
          });
 
          findUser.token = token;
          findUser.password = undefined;
 
 
 
          const options = {
             expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
             httpOnly: true,
          }
 
          res.cookie("token", token, options).status(200).json({
             success: true,
             token,
             findUser,
             message: 'User Logged in successfully',
          });
 
 
       }
 
       else {
          return res.status(400).json({
             success: false,
             message: "wrong password entered"
          });
       }
 
 
    }
    catch (error) {
       console.log(error);
       return res.status(400).json({
          success: false,
          message: 'Login Failure',
       });
 
 
    }
 
 }

 exports.createJob = async (req, res) => {
    const { email,fullName,phoneNumber,streetAddress,jobTitle } = req.body;
    try {
        const newJob = new Job({
         fullName,
         phoneNumber,
         streetAddress,
         email,
         jobTitle
        });
        const savedJob = await newJob.save();
        res.status(201).json({ message: 'Job created successfully', data: savedJob });

       
    } catch (error) {
        res.status(500).json({ message: 'Failed to create job', error: error.message });
    }
};

exports.getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find();
        res.status(200).json({ success: true, data: jobs });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch jobs', error: error.message });
    }
};


exports.generateotp=async (req,res)=>{

    try{
    
      const {email}=req.body;
      console.log(email)
      var otp= otpgenerator.generate(6,{
       digits:true,
       lowerCaseAlphabets:false,
       upperCaseAlphabets:false,
       specialChars:false
      });
      console.log(otp);
      const otpalreadypresent=await Otp.findOne({otpcode:otp});
    
      while(otpalreadypresent){
        otp= otpgenerator.generate(6,{
          digits:true,
          lowerCaseAlphabets:false,
          upperCaseAlphabets:false,
          specialChars:false
         });
        
        
      }
    
      const newOtp=await Otp.create({
       otpcode:otp,
       email
      });
    
      res.status(200).json({
       success:true,
       message:"the otp is created successfully",
       otp:newOtp.otpcode
    
      });
    }
    catch(error){
       console.log(error);
       res.status(400).json({
          success:false,
          message:"the otp is not created",
          
       
         });
    
    }
    
    }
    
    exports.checkOtp=async (req,res,next)=>{
    
       try{
         
          const {otp,email}=req.body;
    
          const findOtp=await Otp.findOne({email:email}).sort({ createdAt: 'desc' });
          console.log(findOtp);
          if(!findOtp){
            res.status(400).json({
             success:false,
             message:"the otp entered is not matching"
          })
          }
           res.status(200).json({
                success:true,
                message:"the otp is matched successfully",
                otp
             });
            next();
       }
       catch(error){
    
        console.log(error);
    
        res.status(200).json({
          success:false,
          message:"an error ocurred"
       });
       }
    
    
    }
    


exports.sendEmail = async (req, res) => {
    try {
        const { email,fullName,phoneNumber,streetAddress,jobTitle} = req.body; 

        const newJob = new Job({
         fullName,
         phoneNumber,
         streetAddress,
         email,
         jobTitle
     });
     const savedJob = await newJob.save();

        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        

        let info = await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: "job applied",
         html:`
            <div style="background-color: #ffffff; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #333333;">Your Company - Job Application Response for ${jobTitle}</h2>
            <p>Dear ${fullName},</p>
            <p>We would like to thank you for your recent job application to ${jobTitle} at our company. We have received your application and would like to inform you that your application is currently under review.</p>
            <p>If your qualifications and experience match our requirements, we will reach out to you shortly to schedule an interview. Please feel free to reach out to us if you have any further questions or require additional information.</p>
            <p>Thank you once again for your interest in joining our team.</p>
            <p>Best regards,</p>
            <p style="font-weight: bold;">Emmet Project team,<br>Emmet enterprises</p>
        </div>
            `,
        });
       
        console.log('Message sent: %s', info.messageId);
        res.status(200).json({ success : true , message: 'Email sent successfully', messageId: info.messageId });


    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Failed to send email', error: error.message });
    }
};








