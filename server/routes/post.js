const express = require('express');
const router = express.Router();
const {verify, verifyAdmin} = require('../auth');
const postControllers = require('../controllers/post')

router.post('/create-post', verify, postControllers.createPost);
router.get('/get-post/:postId', postControllers.getPost);
router.get('/get-all-posts', postControllers.getAllPosts);
router.delete('/delete-post/:postId', verify, postControllers.deletePost);
router.patch('/update-post/:postId', verify, postControllers.updatePost);
router.patch('/comment-to-post/:postId', verify, postControllers.commentToPost);
router.get('/view-post-comments/:postId', postControllers.viewPostComments);

router.delete('/admin-delete-post/:postId', verify, verifyAdmin, postControllers.deletePostByAdmin);
router.patch('/admin-delete-comment/:commentId', verify, verifyAdmin, postControllers.deleteCommentByAdmin);

module.exports = router;