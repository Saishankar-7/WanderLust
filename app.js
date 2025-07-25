if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
}

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const User=require("./models/user.js");
const passport=require("passport");
const LocalStrategy=require("passport-local");


const listingRouter=require("./routes/listings.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"public")));


const db_URL=process.env.ATLASDB_URL;
main().then(()=>{
    console.log("Database connected succefully");
}).catch((err)=> console.log(err));

async function main(){
    await mongoose.connect(db_URL);  
};
const store= MongoStore.create({
    mongoUrl:db_URL,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24 * 3600,
});
store.on("error",()=>{
    console.log("Error in MONGO SESSION STORE",err);
});
const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httponly:true
    }
};
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);



//page not found
// Define all your routes above this
app.use((req, res, next) => {
    const err = new Error("Page Not Found!");
    err.status = 404;
    next(err);
});


// Error-handling middleware
app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;
//   res.status(status).send(message);
res.status(status).render("error.ejs",{message});
});

app.listen(8080,()=>{
    console.log("Server connected successfully");
}); 