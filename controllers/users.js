const User=require("../models/user.js");
module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signUp=async(req,res)=>{
    try{
    let {username,email,password}=req.body;
    const newuser=new User({email,username});
    const registerUser=await User.register(newuser,password);
   console.log(registerUser);
   req.login(registerUser,(err)=>{
    if(err){ next(err);}
    req.flash("success","Welcome to WanderLust");
   res.redirect("/listings");
   })
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.logIn=async(req,res)=>{
   req.flash("success","Welcome to WanderLust");
   let redirectUrl=res.locals.redirectUrl || "/listings";
   res.redirect(redirectUrl);  
}

module.exports.logOut=(req,res)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logged you Out!");
        res.redirect("/listings");
    });
}