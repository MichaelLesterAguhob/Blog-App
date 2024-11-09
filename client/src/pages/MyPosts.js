import { useContext, useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import UserContext from "../UserContext";
import Swal from "sweetalert2";


export default function Posts() {
    const {user} = useContext(UserContext);
    const [posts, setPosts] = useState([]);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [btnPost, setBtnPost] = useState(false);
    
   
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
            setPosts(data.posts.map(post => {
                const date = new Date(post.creationDate);
                const dateCreated = date.toLocaleDateString();
                const timeCreated = date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
                return(
                   <Col xs={12} sm={12} md={10} lg={10} key={post._id} className="p-2">
                        <Card>
                            <Card.Header className="d-md-flex justify-content-between">
                                <span>{post.author.userId.username}</span>
                                <Card.Text>{dateCreated}  {timeCreated}</Card.Text>
                            </Card.Header>
                            <Card.Body>
                                <h5>{post.title}</h5>
                                <Card.Text>{post.content}</Card.Text>
                            </Card.Body>
                        </Card>
                   </Col>
                )
            }))
            console.log(data)
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

    return (
        <Container className="posts-container mt-5 h-100 overflow-y-auto">
            <h1 className="mt-5 text-dark">Posts</h1>
            <Button className="btn btn-success">Create Post</Button>

            <Form onSubmit={(e) => createPost(e)}>
                <Form.Group>
                    <Form.Label>Title</Form.Label>
                    <Form.Control type="text" placeholder="Enter title" required value={title} onChange={(e) => setTitle(e.target.value)}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Content</Form.Label>
                    <Form.Control type="text" placeholder="Enter title" required value={content} onChange={(e) => setContent(e.target.value)}/>
                </Form.Group>
                {
                    btnPost === true ?
                    <Button type="submit" className="btn btn-primary">Post</Button>
                    :
                    <Button type="submit" className="btn btn-primary" disabled>Post</Button>
                }
                <Button className="btn btn-warning" onClick={() => {setTitle(''); setContent('')}}>Cancel</Button>
            </Form>

            <Container fluid>
                <Row className="d-flex justify-content-center">
                    {posts}
                </Row>
            </Container>
        </Container>
    )
}






