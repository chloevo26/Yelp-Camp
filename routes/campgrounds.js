const express = require('express');
const router = express.Router();
const Campground = require("../models/campground");

// INDEX route: show all camgrounds
router.get("/", (req, res) => {
    // get all campgrounds from DB
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            // send data to ejs file  
            res.render("campgrounds/index", { campgrounds: allCampgrounds, currentUser: req.user });
        }
    });

});

// convention: get("/campgrounds" => show all campgrounds)
// and post("/campgrounds" => post request to make new campground)
// want to: get data from form and add to campgrounds array
//          redirect to campground page

//CREATE route: add new campground to DB
router.post("/", isLoggedIn, (req, res) => {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = { id: req.user._id, username: req.user.username };
    var newCampground = { name: name, image: image, description: desc, author: author };
    // campgrounds.push(newCampground);  ==> don't need to push to newCampground array because we use DB instead
    // create new campground & save to DB
    Campground.create(newCampground, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            // console.log(newlyCreated);
            res.redirect("/");
        }
    });


});

// NEW route: show form to create new campground
router.get("/new", isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

// SHOW route: show info about 1 campground
router.get("/:id", (req, res) => {
    // find the camground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            // console.log(foundCampground);
            // render show template with that campground
            res.render("campgrounds/show", { campground: foundCampground });
        }
    });
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", checkCampgroundOwnership, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        res.render("campgrounds/edit", { campground: foundCampground });
    });

});


// UPDATE CAMPGROUND ROUTE
router.put("/:id", checkCampgroundOwnership, function (req, res) {
    // find and update correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", checkCampgroundOwnership, function (req, res) {
    Campground.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds")
        }
    });
});

// middle ware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login")
};


// middle ware
function checkCampgroundOwnership(req, res, next) {
    if (req.isAuthenticated()) { // check if the user is logged in
        Campground.findById(req.params.id, function (err, foundCampground) { // find the campground
            if (err) {
                res.redirect("/campgrounds")
            } else {
                // check if the user own the campground
                // if the currently log in user is not the author of the post
                // he/she can't edit it
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }

            }
        });
    } else {
        res.redirect("back"); // take the user back to the previous page
    }
}
module.exports = router;
