
import { useState, useContext, useEffect } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { Link, Navigate } from "react-router-dom";
import Swal from "sweetalert2";
import UserContext from "../UserContext";

export default function Login() {

    const {user, setUser} = useContext(UserContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitBtn, setSubmitBtn] = useState(false);


    const login = async (e) => {
        e.preventDefault();
     
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });
    
            if(!response.ok) {
                let responseData = await response.json();
                throw new Error(responseData.message || responseData.error || "Login Failed");
            }
    
            const data = await response.json();
  
            if(data) {
  
                if(data.access) {
                    localStorage.setItem('token', data.access);
                    getUserDetails(data.access);
                    setEmail('');
                    setPassword('');
                    Swal.fire({
                        title: 'Login Successfully',
                        icon: 'success',
                        timer: 1000,
                    });
                    
                } else if(data.message === "Email and password do not match") {
                    Swal.fire({
                        title: data.message,
                        icon: 'error',
                        timer: 1500,
                    })
                } else if(data.error === "No Email Found") {
                    Swal.fire({
                        title: data.error,
                        icon: 'error',
                        timer: 1500,
                    })
                }
            } else {
                Swal.fire({
                    title: 'Something went wrong',
                    icon: 'error',
                    timer: 1500,
                })
            }
        } catch (error) {
            Swal.fire({
                title: error,
                icon: 'error',
                timer: 1500,
            })
        }
    }

   const getUserDetails = async (token) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if(!response.ok) {
                let responseData = await response.json();
                throw new Error(responseData.error || "Error on getting user details")
            }

            const data = await response.json();
            if(data) {
                setUser({
                    _id: data.user._id,
                    isAdmin: data.user.isAdmin
                })
            } else {
                setUser({
                    _id: null,
                    isAdmin: null
                })
            }

        } catch (error) {
            console.error(error);
        }
   }
        

    useEffect(() => {
        if(email !== "" && password !== "") {
            setSubmitBtn(true);
        } else {
            setSubmitBtn(false);
        }
    }, [email, password])

    return (
        (user._id !== null) ?
        <Navigate to={'/'} />
        :
        <Container className="mt-5 h-75 d-flex flex-column login-container">
            <h1 className="tagline mt-5 mb-5 mx-auto text-light fw-bolder text-center">Connecting ideas, igniting change. Start here!</h1>
            <Row className="my-auto pb-5">
                <Col className="mx-auto" xs={12} sm={9} md={7} lg={5}>
                    <Form onSubmit={(e) => login(e)} className="rounded p-4 shadow login">
                        <h1 className="text-center mb-4">Login</h1>
                        <Form.Group className="mb-4">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" required placeholder="Enter valid email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-4">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" required className="mb-1" placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Link to={'/#'}>Forgot Password</Link>
                        </Form.Group>

                        {
                            submitBtn === true ?
                            <Button type="submit" className="btn btn-primary w-100 mb-4">Login!</Button>
                            :
                            <Button type="submit" className="btn btn-primary w-100 mb-4" disabled>Login!</Button>
                        }
                        <span className="">Don&apos;t have an account? <Link to={'/register'}>Register</Link></span>
                    </Form>
                </Col>
            </Row>
        </Container>
        
    )
}