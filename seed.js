const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment")

var data = [
    {
        name: "Cloud's Rest",
        image: "https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80",
        description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Saepe placeat deleniti aliquam recusandae quam rerum ipsum, alias voluptatum cumque reiciendis sunt sit expedita doloribus laboriosam libero iste. Nostrum, dolore qui."

    },
    {
        name: "Desert Mesa",
        image: "https://images.unsplash.com/photo-1497900304864-273dfb3aae33?ixlib=rb-1.2.1&auto=format&fit=crop&w=1576&q=80",
        description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Saepe placeat deleniti aliquam recusandae quam rerum ipsum, alias voluptatum cumque reiciendis sunt sit expedita doloribus laboriosam libero iste. Nostrum, dolore qui."
    },
    {
        name: "Canyon Floor",
        image: "https://images.unsplash.com/photo-1455763916899-e8b50eca9967?ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80",
        description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Saepe placeat deleniti aliquam recusandae quam rerum ipsum, alias voluptatum cumque reiciendis sunt sit expedita doloribus laboriosam libero iste. Nostrum, dolore qui."
    }
]
function seedDB() {
    // remove campgrounds
    Campground.remove({}, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("removed campgrounds");
        }

        //add a new campground
        data.forEach(function (seed) {
            Campground.create(seed, function (err, campground) {
                if (err) {
                    console.log("Error");
                } else {
                    console.log("Added a camground");

                    //creat comment
                    Comment.create({
                        text: "This place is great, but I wish there was internet",
                        author: "Homer"
                    }, function (err, comment) {
                        if (err) {
                            console.log("error");
                        } else {
                            //associate with the campground
                            console.log("added new comment");
                            campground.comments.push(comment);
                            campground.save();
                        }
                    });
                }
            });
        });
    });



};

module.exports = seedDB;

