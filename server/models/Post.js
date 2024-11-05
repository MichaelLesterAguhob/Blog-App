
const mongoose = require("mongoose")

const postSchema = mongoose.Schema({

    title: {
        type: String, 
        required: [true, "Title is required"]
    }, 
    content: {
        type: String, 
        required: [true, "Content is required"]
    }, 
    author: {
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', 
            required: [true, "Author's ID is required"]
        }
    },
    creationDate: {
        type: Date, 
        default: Date.now
    },
    comments: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null
        },
        comment: {
            type: String,
            default: null
        }
    }]
}) 

module.exports = mongoose.model('Post', postSchema);