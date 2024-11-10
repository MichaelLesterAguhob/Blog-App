import { useContext, useEffect, useState } from "react";
import { Button, Modal, Form, Container } from "react-bootstrap";
import Swal from "sweetalert2";
import UserContext from "../UserContext";

export default function ViewPost({postData}) {

    const {user} = useContext(UserContext);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState();
    const [viewModal, setViewModal] = useState(false);
    const [btnSubmitComment, setBtnSubmitComment] = useState(false);
    const [comment, setComment] = useState('');
    const [allComments, setAllComments] = useState([]);

    useEffect(() => {
        if(viewModal === true) {
            setTitle(postData.title);
            setContent(postData.content);
        } else {
            setTitle('');
            setContent('');
        }
    }, [viewModal])

    function hideViewModal(){
        setViewModal(false);
    }

    useEffect(() => {
        if(comment !== ""){
            setBtnSubmitComment(true);
        } else {
            setBtnSubmitComment(false);
        }
    }, [comment])


    const submitComment = async(e) => {
        e.preventDefault();
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/posts/comment-to-post/${postData._id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                comment: comment
            })
        })

        if(!response.ok) {
            let respo = await response.json();
            throw new Error(respo.message || respo.error || 'Failed commenting to post')
        }

        const data = await response.json();
        if(data) {
            setComment('');
            // hideViewModal()
            getAllComments();
            Swal.fire({
                title: data.message,
                icon: 'success',
                timer: 1000
            })
        } else {
            Swal.fire({
                title: 'Something went wrong',
                icon: 'error',
                timer: 1000
            })
        }
    }


    const getAllComments = async () => {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/posts/view-post-comments/${postData._id}`)

        if(!response.ok) {
            let respo = await response.json();
            throw new Error(respo.message || respo.error || 'Failed loading all post comments')
        }

        const data = await response.json();
        if(data) {
            setAllComments(data.comments.map(comment => {
                return(
                  <div key={comment._id} className="individual-comment d-flex flex-column">
                    <span>{comment.userId.username}</span>
                    <p className="comment-content">{comment.comment}</p>
                    {
                        user.isAdmin === true ?
                        <button className="delete-comment ms-auto me-2 mb-2" onClick={() => deleteComment(comment._id)}>remove</button>
                        :
                        null
                    }
                  </div>
                )
            }))
            
        } else {
            Swal.fire({
                title: 'Something went wrong',
                icon: 'error',
                timer: 1000
            })
        }
    }

    const deleteComment = async (commentId) => {
        
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/posts/admin-delete-comment/${commentId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                postID: postData._id
            })
        })

        if(!response.ok) {
            console.log(response)
            let respo = await response.json();
            throw new Error(respo.message || respo.error || "Error while deleting post comment")
        }

        const data = await response.json();
        if(data) {
            getAllComments()
            Swal.fire({
                title: data.message,
                icon: 'success',
                timer: 800
            })
        } else {
            Swal.fire({
                title: 'Something went wrong',
                icon: 'error',
                timer: 1000
            })
        }
    }

    return (
        <>
        <Button onClick={() => {setViewModal(true); getAllComments()}} className="btn btn-info btn-sm">View</Button>
        
        {
            viewModal === true ?
                <Modal show={viewModal} onHide={hideViewModal} className="mt-5 mb-5 viewModal"> 
                <Modal.Header className="d-flex flex-column">
                    <Modal.Title>Post Viewing</Modal.Title>
                    <span className="text-primary me-auto">Posted by: {postData.author.userId.username}</span>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={(e) => submitComment(e)} className="mb-3">
                        <Form.Group className="mb-4 d-flex flex-column justify-content-start">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" readOnly value={title} onChange={(e) => setTitle(e.target.value)}/>
                        </Form.Group>
                        <Form.Group className="mb-4">
                            <Form.Label>Content</Form.Label>
                            <textarea type="text" className="form-control" cols="50" rows="5" readOnly value={content} onChange={(e) => setContent(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3 d-flex flex-column">
                            <Form.Label>Write Comment</Form.Label>
                            <textarea type="text" className="form-control" cols="50" rows="2" placeholder="Enter comment" required value={comment} onChange={(e) => setComment(e.target.value)} />
                        </Form.Group>
                        {
                            btnSubmitComment === true ?
                            <Button type="submit" className="btn btn-primary me-2" >Submit</Button>
                            :
                            <Button type="submit" className="btn btn-primary btn-sm me-2" disabled>Submit</Button>
                        }
                        <Button className="btn btn-warning btn-sm" onClick={() => hideViewModal()}>Cancel</Button>
                    </Form>
                    
                    <span>Comments</span>
                    <Container fluid className="mt-2 comments-container">
                        {
                            allComments.length !== 0 ?
                                allComments
                            :
                            <div className="individual-comment d-flex flex-column">
                                <p className="comment-content">Be the first to comment on this post!</p>
                            </div>
                        }
                    </Container>
                </Modal.Body>
            </Modal>
            :
            null
        }
       
        </>

        
    )
}