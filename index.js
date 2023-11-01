const express=require('express');
const app=express();

require('dotenv').config();



app.use(express.json());

const PORT=process.env.PORT || 4000;

const {databaseConnect}=require('./config/database');
databaseConnect();



const routes = require("./routes/routes");
app.use("/api/v1", routes);





app.listen(PORT, () => {
    console.log(`App is listening at ${PORT}`);
})