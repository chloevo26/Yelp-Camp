const express = require('express');
const router = express.Router({ mergeParams: true });
const Campground = require('../models/campground');
const Comment = require("../models/comment");

// =======================
// COMMENTS ROUTES
// =======================

// comment new
router.get("/new", isLoggedIn, function (req, res) {
    // find campground by ID
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { campground: campground });
        }
    })

});

// comment create route
router.post("/", isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            // create new comment
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save comment
                    comment.save()
                    // add new comment to the campground
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    })
});

// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", checkCommentOwnership, function (req, res) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", { campground_id: req.params.id, comment: foundComment });
        }
    })

})

// COMMENT UPDATE ROUTE
router.put("/:comment_id", checkCommentOwnership, function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComments) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

// COMMENT DELETE ROUTE
router.delete("/:comment_id", checkCommentOwnership, function (req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
});

// middle ware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login")
};

function checkCommentOwnership(req, res, next) {
    if (req.isAuthenticated()) { // check if the user is logged in
        Comment.findById(req.params.comment_id, function (err, foundComment) { // find the campground
            if (err) {
                res.redirect("/campgrounds")
            } else {
                // check if the user own the comment
                // if the currently log in user is not the author of the comment
                // he/she can't edit it
                if (foundComment.author.id.equals(req.user._id)) {
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