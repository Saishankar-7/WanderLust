const Listing=require("../models/listing.js");
const geocodeLocation = require("../geocoding.js"); // adjust path as needed;
module.exports.index=async(req,res)=>{
    let allistings=await Listing.find({});
    res.render("listings/index.ejs",{allistings});
};

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
}


module.exports.showListing=async(req,res)=>{
     let {id}=req.params;
     const listing= await Listing.findById(id)
     .populate({path:"review",populate:{path:"author"},})
     .populate("owner");
     if(!listing){
        req.flash("error","Listing you requested for does not exist");
        return res.redirect("/listings");
     }
     console.log(listing);  
     res.render("listings/show.ejs",{listing});
}

module.exports.createListing=async(req,res,next)=>{
      const { location } = req.body.listing;
    const geoData = await geocodeLocation(location);
    // console.log(geoData);
    let url=req.file.path;
    let filename=req.file.filename;
  const  newlist=new Listing(req.body.listing);
  newlist.owner=req.user._id;
  newlist.image={url,filename};
  newlist.geometry = {
    type: 'Point',
    coordinates: [geoData.lng, geoData.lat]
  };
   const savedlisiting=await newlist.save();
   console.log(savedlisiting);
   req.flash("success","New lisiting Created");
  res.redirect("/listings");
}

module.exports.editForm=async(req,res)=>{
      let {id}=req.params;
     const listing= await Listing.findById(id);
     if(!listing){
        req.flash("error","Listing you requested for does not exist");
        return res.redirect("/listings");
     }
     let originalUrl=listing.image.url;
     originalUrl=originalUrl.replace("/upload","/upload/w_250/")
     res.render("listings/edit.ejs",{listing,originalUrl});
}

module.exports.updateListing=async(req,res)=>{
  let {id}=req.params;
  let lisiting=await Listing.findByIdAndUpdate(id,{...req.body.listing});
  if(typeof req.file!="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    lisiting.image={url,filename};
    await lisiting.save();
  }
   req.flash("success","lisiting Updated");
  res.redirect(`/listings/${id}`); 
}

module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    let deletedlist=await Listing.findByIdAndDelete(id);
    console.log(deletedlist);
     req.flash("success","listing Deleted");
   res.redirect("/listings");
}

