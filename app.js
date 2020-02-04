require("dotenv").config();
var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Blogpost = require("./models/blogpost"),
    Comment = require("./models/comment"),
    User = require("./models/user");


// Requiring Routes
var commentRoutes = require("./routes/comments"),
    blogpostRoutes = require("./routes/blogposts"),
    indexRoutes = require("./routes/index");

// console.log(process.env.DATABASEURL);

var url = process.env.DATABASEURL;

mongoose.connect(process.env.DATABASEURL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    }).then(() => { console.log('Database is connected') }, err => { console.log('Can not connect to the database' + err) });

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIGURATION
app.use(
    require("express-session")({
        secret: "Machielina secretly loves Boeffie more than Molly",
        resave: false,
        saveUninitialized: false
    })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/blogpostss", blogpostRoutes);
app.use("/blogposts/:id/comments", commentRoutes);


app.listen(process.env.PORT, process.env.IP, function () {
    console.log("My personal blog server is running!");
});