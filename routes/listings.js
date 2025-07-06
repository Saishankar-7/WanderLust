const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const lisitingController=require("../controllers/listings.js");
const { route } = require("./review.js");
const multer  = require('multer');
const {storage} =require("../cloudConfig.js");
const upload = multer({ storage });


//Router .route
router.route("/")
.get(wrapAsync(lisitingController.index))
.post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(lisitingController.createListing));
 
//new route
router.get("/new",isLoggedIn,lisitingController.renderNewForm);
router.route("/:id")
.get(wrapAsync(lisitingController.showListing))
.put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,isLoggedIn,wrapAsync(lisitingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(lisitingController.destroyListing));
//edit Route
router.get("/:id/edit",isLoggedIn,wrapAsync(lisitingController.editForm));


module.exports=router;