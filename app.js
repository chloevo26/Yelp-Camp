const express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    User = require("./models/user"),
    methodOverride = require("method-override"),
    seedDB = require("./seed");

const commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");

// seed databases
// seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// add current user to all the routes
// this prevent manually add to each routes
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
})


// connect to yelp_camp database
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useFindAndModify', false);


// Campground.create(
//     {
//         name: "Granite Hill",
//         image: "https://cdn.pixabay.com/photo/2018/12/24/22/19/camping-3893587_960_720.jpg",
//         description: "This is a huge granite hill, no bathrooms. No water. Beautiful granite"
//     }, function (err, campground) {
//         if (err) {
//             console.log("Error");
//         } else {
//             console.log("NEWLY CREATED CAMPGROUND");
//             console.log(campground);
//         }
//     }
// );




// tell express to use body-parser
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));

app.use(methodOverride("_method"));

// NO longer use this array. Instead we use DB
// var campgrounds = [
//     { name: "Salmon Creek", image: "https://cdn.pixabay.com/photo/2016/02/18/22/16/tent-1208201_960_720.jpg" },
//     { name: "Granite Hill", image: "https://cdn.pixabay.com/photo/2018/12/24/22/19/camping-3893587_960_720.jpg" },
//     { name: "Mountain Goat's Rest", image: "https://cdn.pixabay.com/photo/2017/08/04/20/04/camping-2581242_960_720.jpg" },
//     { name: "Salmon Creek", image: "https://cdn.pixabay.com/photo/2016/02/18/22/16/tent-1208201_960_720.jpg" },
//     { name: "Granite Hill", image: "https://cdn.pixabay.com/photo/2018/12/24/22/19/camping-3893587_960_720.jpg" },
//     { name: "Salmon Creek", image: "https://cdn.pixabay.com/photo/2016/02/18/22/16/tent-1208201_960_720.jpg" },
//     { name: "Granite Hill", image: "https://cdn.pixabay.com/photo/2018/12/24/22/19/camping-3893587_960_720.jpg" },
//     { name: "Salmon Creek", image: "https://cdn.pixabay.com/photo/2016/02/18/22/16/tent-1208201_960_720.jpg" },
//     { name: "Granite Hill", image: "https://cdn.pixabay.com/photo/2018/12/24/22/19/camping-3893587_960_720.jpg" }

// ];

// requiring routes
app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
// take all campgroundRoutes and append /campground in front of them
// use this to shorten the route decoration in campgrounds.js
// instead of app.get("/campgrounds") now app.get("/")
app.use("/campgrounds", campgroundRoutes);


const PORT = process.env.PORT || 3000
app.listen(PORT, process.env.IP, () => {

    console.log("The YelpCamp server has started!");
})