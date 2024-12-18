import { useContext, useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Modal, Row } from "react-bootstrap";
import UserContext from "../UserContext";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import ViewPost from "../components/ViewPost"

export default function Posts() {
    const {user} = useContext(UserContext);
    const [posts, setPosts] = useState([]);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [btnPost, setBtnPost] = useState(false);
    
    const [AddModal, setAddModal] = useState(false);

    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [btnEditPost, setEditBtnPost] = useState(false);
    const [EditModal, setEditModal] = useState(false);

    const [selectedPostID, setSelectedPostID] = useState('');

    function hideModal() {
        setAddModal(false);
        setTitle('');
        setContent('');
    }

    function showAddModal() {
        setAddModal(true);
    }

    const createPost = async (e) => {
        e.preventDefault()
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/posts/create-post`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                title: title,
                content: content
            })
        })

        if(!response.ok) {
            let respo = await response.json();
            throw new Error(respo.message || respo.error || 'Failed creating post')
        }

        const data = await response.json();
        if(data) {
            setContent('');
            setTitle('');
            getAllPosts();
            hideModal()
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

    useEffect(() => {
        if(title !== "" && content !== "") {
            setBtnPost(true);
        } else {
            setBtnPost(false);
        }
    }, [title, content])


    const getAllPosts = async () => {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/posts/get-all-posts`)

        if(!response.ok) {
            let respo = await response.json();
            throw new Error(respo.message || respo.error || 'Failed loading all post')
        }

        const data = await response.json();
  
        if(data) {
            if(data.posts.length <= 0) {
                return setPosts(()=> {
                    return (
                        <h3 className="mt-5">No posts yet. Be the first to post here!</h3>
                    )
                })
            }
            setPosts(data.posts.map(post => {
                const date = new Date(post.creationDate);
                const dateCreated = date.toLocaleDateString();
                const timeCreated = date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
                return(
                   <Col xs={12} sm={12} md={10} lg={10} key={post._id} className="p-2">
                        <Card>
                            <Card.Header className="d-md-flex justify-content-between">
                                <span className="text-primary">Posted by: {post.author.userId.username}</span>
                                <Card.Text className="text-muted">{dateCreated}  {timeCreated}</Card.Text>
                            </Card.Header>
                            <Card.Body>
                                <h5>{post.title}</h5>
                                <Card.Text>{post.content}</Card.Text>
                                {
                                    user.isAdmin === true ? 
                                    <Container fluid className="d-flex justify-content-end gap-2">
                                        {
                                            user._id !== null ?
                                            <ViewPost postData={post}/>
                                            :
                                            null
                                        }
                                        <Button className="btn btn-danger" onClick={() => {deletPost(post._id)}}>delete</Button>
                                    </Container>
                                    :
                                    (user._id !== null && post.author.userId._id === user._id ) ?
                                        <Container fluid className="d-flex justify-content-end gap-2">
                                            {
                                                user._id !== null ?
                                                <ViewPost postData={post}/>
                                                :
                                                null
                                            }
                                            <Button 
                                                className="btn btn-primary bnt-sm" 
                                                onClick={() => {
                                                    showEditModal(); 
                                                    setSelectedPostID(post._id); 
                                                    setNewTitle(post.title); 
                                                    setNewContent(post.content)}}>Edit
                                            </Button>
                                            <Button 
                                                className="btn btn-danger bnt-sm" 
                                                onClick={() => {
                                                    deletPost(post._id)
                                                    }}>Delete
                                            </Button> 
                                        </Container>
                                    :
                                        user._id !== null ?
                                        <ViewPost postData={post}/>
                                        :
                                        null
                                }
                                
                            </Card.Body>
                        </Card>
                   </Col>
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

    useEffect(() => {
        getAllPosts();
    },[])


    function hideEditModal() {
        setEditModal(false);
        setNewTitle('');
        setNewContent('');
    }

    function showEditModal() {
        setEditModal(true);
    }

    const updatePost = async (e) => {
        e.preventDefault()
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/posts/update-post/${selectedPostID}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                title: newTitle,
                content: newContent
            })
        })

        if(!response.ok) {
            let respo = await response.json();
            throw new Error(respo.message || respo.error || 'Failed updating post')
        }

        const data = await response.json();
        if(data) {
            setNewContent('');
            setNewTitle('');
            getAllPosts();
            hideEditModal();
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

    useEffect(() => {
        if(newTitle !== "" && newContent !== "") {
            setEditBtnPost(true);
        } else {
            setEditBtnPost(false);
        }
    }, [newTitle, newContent])

    
    
    const deletPost = async (toDeleteId) => {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/posts/delete-post/${toDeleteId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
        })

        if(!response.ok) {
            let respo = await response.json();
            throw new Error(respo.message || respo.error || 'Failed deleting post')
        }

        const data = await response.json();
        if(data) {
            getAllPosts();
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

    return (
        <Container className="posts-container mt-5 pt-5 h-100 overflow-y-auto">
             <Container fluid className="d-flex justify-content-start">
                <h1 className="text-dark me-5">Posts</h1>
                {
                    user._id !== null ?
                    <Button className="btn btn-success ms-5 btn-sm" onClick={() => {showAddModal()}}>Create Post</Button>
                    :
                    <Link className="btn btn-success ms-5 btn-sm" to={'/login'} >Login to Create Post</Link>
                }
            </Container>

            <Modal show={AddModal} onHide={hideModal} className="mt-5"> 
                <Modal.Header closeButton>
                    <Modal.Title>Create Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={(e) => createPost(e)}>
                        <Form.Group className="mb-4">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" placeholder="Enter title" required value={title} onChange={(e) => setTitle(e.target.value)}/>
                        </Form.Group>
                        <Form.Group className="mb-4">
                            <Form.Label>Content</Form.Label>
                            <textarea type="text" className="form-control" cols="50" rows="10" placeholder="Enter content" required value={content} onChange={(e) => setContent(e.target.value)} /> 
                        </Form.Group>
                        {
                            btnPost === true ?
                            <Button type="submit" className="btn btn-primary me-2">Post</Button>
                            :
                            <Button type="submit" className="btn btn-primary me-2" disabled>Post</Button>
                        }
                        <Button className="btn btn-warning" onClick={() => hideModal()}>Cancel</Button>
                    </Form>
                </Modal.Body>
            </Modal>
          
            <Modal show={EditModal} onHide={hideEditModal} className="mt-5"> 
                <Modal.Header closeButton>
                    <Modal.Title>Edit Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={(e) => updatePost(e)}>
                        <Form.Group className="mb-4">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" placeholder="Enter new title" required value={newTitle} onChange={(e) => setNewTitle(e.target.value)}/>
                        </Form.Group>
                        <Form.Group className="mb-4 d-flex flex-column">
                            <Form.Label>Content</Form.Label>
                            <textarea type="text" className="form-control" cols="50" rows="10" placeholder="Enter new content" required value={newContent} onChange={(e) => setNewContent(e.target.value)} /> 
                        </Form.Group>
                        {
                            btnEditPost === true ?
                            <Button type="submit" className="btn btn-primary me-2" >Update</Button>
                            :
                            <Button type="submit" className="btn btn-primary me-2" disabled>Update</Button>
                        }
                        <Button className="btn btn-warning" onClick={() => hideEditModal()}>Cancel</Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <Container fluid>
                <Row className="d-flex justify-content-center">
                    {posts}
                </Row>
            </Container>
        </Container>
    )
}






