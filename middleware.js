const Listing = require("./models/listing");
const Review = require("./models/review.js");
const { listingSchema,reviewSchema}=require("./schema.js");
const ExpressError=require("./utils/ExpressError.js");
module.exports.isLoggedIn=(req,res,next)=>{
    
     if (!req.isAuthenticated()) {
        // Only store redirect URL for GET requests
        if (req.method === "GET") {
            req.session.redirectUrl = req.originalUrl;
        } else {
            // For POST, DELETE, PUT — fallback to Referer (the page user came from)
            req.session.redirectUrl = req.get("Referer") || "/";
        }
        req.flash("error","You must be logged in before making Changes");
         return res.redirect("/login");
    }
     next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async (req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id))
    {
        req.flash("error","You are not the owner of the Listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing=((req,res,next)=>{
     let {error}=listingSchema.validate(req.body);
    if(error){
        const errMsg=error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
 });

 module.exports.validateReview=((req,res,next)=>{
     let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
 });
 module.exports.isReviewAuthor=async (req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id))
    {
        req.flash("error","You are not the author of this Review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};