if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expressError.js");
const MongoStore = require('connect-mongo');
const listingRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/users.js");
const session = require("express-session"); 
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
let atlasUrl=process.env.ATLASDB_URL;

const store = MongoStore.create({
    mongoUrl: atlasUrl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter: 24*3600
});

const expressSession={
    store,
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now()+7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true
    }
};

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

async function main(){
    await mongoose.connect(atlasUrl);
}
main()
    .then(()=>{
        console.log("connected to DB ");
    }).catch((err)=>{
        console.log("error",err);
    });

app.listen(8080,()=>{
    console.log("app is listening at port 8080");
});

app.use(session(expressSession));
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
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);


//page not found error
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
});
//error handling middleware
app.use((err,req,res,next)=>{
    let {status=500,message="something went wrong"}=err;
    res.status(status).render("listing/error.ejs",{message});
});