const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
// const ExpressError = require("../utils/expressError.js");


module.exports.createReview=(async(req,res)=>{
    let {id}= req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        throw new ExpressError(404,"listing not found");
    }
    let newReview =new Review (req.body.review);
    newReview.author = req.user._id; 
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    console.log("review saved");
    req.flash("success","New review created");
    res.redirect(`/listings/${listing._id}`);
});

module.exports.deleteReview=(async(req,res)=>{
    let {id,reviewId}= req.params;

    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","review deleted");
    res.redirect(`/listings/${id}`);
});