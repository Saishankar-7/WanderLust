const mongoose=require("mongoose");
const initdata=require("./data.js");
const Listing=require("../models/listing.js");
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
main().then(()=>{
    console.log("Database connected succefully");
}).catch((err)=> console.log(err));

async function main(){
    await mongoose.connect(MONGO_URL);  
}

const initDB= async ()=>
{
    await Listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj,owner:"68635e6a4f55ff4d05434ef4"}));
    await Listing.insertMany(initdata.data);
    console.log("Data inserted into database successfully");
}

initDB();