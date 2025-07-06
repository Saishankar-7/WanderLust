const Listing=require("../models/listing.js");
const Review=require("../models/review.js")
module.exports.createReview=async(req,res)=>
{
    let listing=await Listing.findById(req.params.id);
    let newreview=await  new Review(req.body.review);
    newreview.author=req.user._id;
    console.log(newreview);
    if (!listing) throw new ExpressError(404, "Listing not found"); 
    listing.review.push(newreview);
    await newreview.save();
    await listing.save();
  
     req.flash("success","New Review Created");
    res.redirect(`/listings/${listing._id}`);
}


module.exports.destryoyReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    console.log(reviewId);
    await Listing.findByIdAndUpdate(id, {$pull: {review: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted");
    return res.redirect(`/listings/${id}`);
}