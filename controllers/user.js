const User = require("../models/user.js");

module.exports.singupRender=(req,res)=>{
    res.render("users/signup.ejs")
};

module.exports.signup=(async(req,res)=>{
    try{
        let {username,email,password} = req.body;
        let newUser = new User({
            email:email,
            username:username
        });
        let registerdUser = await User.register(newUser,password);
        req.login(registerdUser,(err)=>{
            if(err){
                next(err);
            }
        req.flash("success","Welcome to Wanderlust");
        res.redirect("/listings");
        })
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
});

module.exports.loginRender=(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login=async (req,res)=>{
    req.flash("success","Welcome back to Wanderlust, you are logged in");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","you are logged out");
        res.redirect("/listings");
    })
};