import { useEffect, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import Swal from "sweetalert2";

export default function ViewPost({postData}) {

    const [title, setTitle] = useState('');
    const [content, setContent] = useState();
    const [viewModal, setViewModal] = useState(false);
    const [btnSubmitComment, setBtnSubmitComment] = useState(false);
    const [comment, setComment] = useState('');
    const [allComment, setAllComment] = useState([]);

    useEffect(() => {
        setTitle(postData.title);
        setContent(postData.content);

    }, [])

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
            hideViewModal()
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
            console.log(data)
            // setPosts(data.posts.map(post => {
            //     return(
                  
            //     )
            // }))
            
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
        <Button onClick={() => {setViewModal(true); getAllComments()}}>View</Button>
        
        <Modal show={viewModal} onHide={hideViewModal} className="mt-5"> 
                <Modal.Header className="d-flex flex-column">
                    <Modal.Title>Post Viewing</Modal.Title>
                    <span className="text-primary me-auto">Posted by: {postData.author.userId.username}</span>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={(e) => submitComment(e)}>
                        <Form.Group className="mb-4 d-flex flex-column justify-content-start">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" readOnly value={title} onChange={(e) => setTitle(e.target.value)}/>
                        </Form.Group>
                        <Form.Group className="mb-4">
                            <Form.Label>Content</Form.Label>
                            <textarea type="text" className="form-control" cols="50" rows="5" readOnly value={content} onChange={(e) => setContent(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-4 d-flex flex-column">
                            <Form.Label>Comment</Form.Label>
                            <textarea type="text" className="form-control" cols="50" rows="2" placeholder="Enter comment" required value={comment} onChange={(e) => setComment(e.target.value)} />
                        </Form.Group>
                        {
                            btnSubmitComment === true ?
                            <Button type="submit" className="btn btn-primary me-2" >Comment</Button>
                            :
                            <Button type="submit" className="btn btn-primary me-2" disabled>Comment</Button>
                        }
                        <Button className="btn btn-warning" onClick={() => hideViewModal()}>Cancel</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>

        
    )
}