const mongoose = require("mongoose");
var commentSchema = mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            // ref: the model we refer to with the objectId above
            // author id is the reference of User's id
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Comment", commentSchema);