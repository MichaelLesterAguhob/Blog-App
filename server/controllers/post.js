const Post = require('../models/Post');
const {errorHandler} = require('../auth');

module.exports.createPost = async (req, res) => {
    try {
        const userID = req.user.id;
        const {title, content} =  req.body;
       
        const newPost = new Post({
            title: title,
            content: content,
            author: {
                userId: userID
            }
        })

        const response = await newPost.save();
        
        return res.status(201).send({
            success: true,
            message: 'Post created successfully',
            response
        });
    } catch(error) {
        errorHandler(error, req, res);
    }
}


module.exports.getAllPosts = async (req, res) => {
    try {

        const response = await Post.find({}).populate('author.userId', 'username').populate('comments.userId', 'username');
        
        return res.status(200).send({
            success: true,
            posts: response
        });
    } catch(error) {
        errorHandler(error, req, res);
    }
}


module.exports.getPost = async (req, res) => {
    try {
        const postID = req.params.postId

        const response = await Post.findOne({_id: postID}).populate('author.userId', 'username').populate('comments.userId', 'username');
        
        return res.status(200).send({
            success: true,
            post: response
        });
    } catch(error) {
        errorHandler(error, req, res);
    }
}


module.exports.deletePost = async (req, res) => {
    try {
        const postID = req.params.postId
        const response = await Post.findByIdAndDelete(postID)
        
        return res.status(200).send({
            success: true,
            message: "Deleted Successfully",
            response
        });
    } catch(error) {
        errorHandler(error, req, res);
    }
}


module.exports.updatePost = async (req, res) => {
    try {
        const postID = req.params.postId
        const {title, content} =  req.body;
        const updatedPost = {
            title: title,
            content: content
        }   

        const response = await Post.findByIdAndUpdate(postID, updatedPost, {new: true});
        return res.status(200).send({   
            success: true,
            response
        });
    } catch(error) {
        errorHandler(error, req, res);
    }
}


module.exports.commentToPost = async (req, res) => {
    try {
        const postID = req.params.postId;
        const userID = req.user.id;
        const {comment} =  req.body;
        
        const newComment = {
            userID: userID,
            comment: comment
        }

        const post = await Post.findOne({_id: postID});
        if(!post) {
            return res.status(404).send({
                success: false,
                message: 'Post not found'
            });
        }
        post.comments.push(newComment);
        
        const response = await post.save();

        return res.status(201).send({
            success: true,
            message: 'Commented Successfully',
            post: response
        });
    } catch(error) {
        errorHandler(error, req, res);
    }
}



module.exports.viewPostComments = async (req, res) => {
    try {
        const postId = req.params.postId;
        const response = await Post.findOne({_id: postId});
        if(!response) {
            return res.status(404).send({
                success: false,
                message: "Post not found"
            });
        }
        return res.status(200).send({
            success: true,
            posts: response.comments
        });
    } catch(error) {
        errorHandler(error, req, res);
    }
}


module.exports.deletePostByAdmin = async (req, res) => {
    try {
        const postID = req.params.postId
        const response = await Post.findByIdAndDelete(postID)
        
        return res.status(200).send({
            success: true,
            message: "Deleted SUccessfully",
            response
        });
    } catch(error) {
        errorHandler(error, req, res);
    }
}


module.exports.deleteCommentByAdmin = async (req, res) => {
    try {
        const {postID} = req.body;
        const commentID = req.params.commentId

        const post = await Post.findOne({_id: postID})
        
        if(!post) {
            return res.status(404).send({
                success: true,
                message: "Post not found"
            });
        }
        let commentIndex = post.comments.findIndex(comment => comment._id.toString() === commentID)

        if(commentIndex === -1 ) {
            return res.status(404).send({
                success: true,
                message: "Comment not found"
            });
        }

        post.comments.splice(commentIndex, 1);
        const response = await post.save();

        return res.status(200).send({
            success: true,
            message: 'Comment deleted successfully'
        });
    } catch(error) {
        errorHandler(error, req, res);
    }
}