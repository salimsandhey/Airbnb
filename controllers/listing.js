const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
let mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index=(async(req,res)=>{
    let allListings = await Listing.find({});
    res.render("listing/index.ejs",{allListings});
});

module.exports.newListing=(req,res)=>{
    res.render("listing/new.ejs");
};

module.exports.createListing=(async(req,res,next)=>{

    let response = await geocodingClient
    .forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
    .send();


    let url = req.file.url;
    let filename = req.file.originalname;
    let newListing = new Listing(req.body.listing);
    newListing.geometry=response.body.features[0].geometry;
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    let saved=await newListing.save();
    console.log(saved);
    req.flash("success","New listing created");
    res.redirect("/listings");
});

module.exports.showListing=(async(req,res)=>{
    let {id}= req.params;
    let listing= await Listing.findById(id).populate({path: "reviews",populate :{path: "author"},}).populate("owner");
    if(!listing){
        req.flash("error","listing you requested for does not exist! ");
        res.redirect("/listings");
    }
    res.render("listing/show.ejs",{listing});
});

module.exports.editListing=(async(req,res)=>{
    let {id} = req.params;
    let listing= await Listing.findById(id);
    if(!listing){
        req.flash("error","listing you requested for does not exist! ");
        res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");
    console.log(originalImageUrl);
    res.render("listing/edit.ejs",{listing,originalImageUrl});
});

module.exports.updateListing=(async(req,res)=>{
    let {id} = req.params;
    let updated = req.body.listing;
    let listing = await Listing.findByIdAndUpdate(id,{...updated});
    if(typeof req.file != "undefined"){
        let url = req.file.url;
        let filename = req.file.originalname;
        listing.image={url,filename};
        await listing.save();
    };
    console.log(listing);
    req.flash("success","listing updated");
    res.redirect(`/listings/${id}`);
});

module.exports.deleteListing=(async(req,res)=>{
    let {id} = req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
    req.flash("success","listing deleted!");
    res.redirect("/listings");
});