const mongoose=require('mongoose');
const nodemailer=require('nodemailer');

const Job=new mongoose.Schema({
    name:{
        type:String,
        require:true
      },
    description:{
        type:String,
        require:true,
      },
     
      salary:{
        type:Number,
        require:true
      },
      companyname:{
        type:String,
        require:true
      }
     


});


Job.post("save",async function(doc){
  try{
       
      console.log("the document is ",doc);
  
      let transporter = nodemailer.createTransport({
          host: process.env.MAIL_HOST,
          auth:{
              user:process.env.MAIL_USER,
              pass: process.env.MAIL_PASS,
          },
      });
  
      let info = await transporter.sendMail({
          from:`debarun`,
          to: doc.email,
          subject: "your job is uploaded on the site",
          html:`<h2>Hello Jee</h2> <p>product Uploaded</p>`,
      })
      
      console.log("INFO", info);
  
  }
  catch(error){
    console.log("mail can't be sent");
  }
  });



module.exports=mongoose.model("Job",Job);