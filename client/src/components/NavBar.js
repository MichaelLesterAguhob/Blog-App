import { useContext, useRef } from "react";
import UserContext from "../UserContext";

import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, NavLink } from 'react-router-dom';

export default function NavBar() {
    const {user} = useContext(UserContext);
    const toggler = new useRef(null);
    function closeNavbar() {
        if(toggler.current && window.innerWidth <= 991){
            toggler.current.click();
        }
    }
    window.addEventListener('resize', () => {
        const viewportWidth = window.innerWidth;
    });

    return (
        <Navbar bg="dark" expand="lg" fixed="top">
            <Container fluid>
                <Navbar.Brand as={Link} to="/" className='text-light'>B L O G</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" className="bg-light" ref={toggler}/>
                <Navbar.Collapse id="basic-navbar-nav">
                   
                    <Nav className="ms-auto" >
                        <Nav.Link onClick={() => closeNavbar()} className='text-light' as={NavLink} to="/" exact="true">POSTS</Nav.Link>
                    </Nav>
                    {
                        user._id !== null ?
                        <>
                            
                            <Nav className="me-auto">
                                <Nav.Link onClick={() => closeNavbar()} className='text-light' as={NavLink} to="/my-posts" exact="true">MY POSTS</Nav.Link>
                            </Nav>
                            <Nav>
                                <Nav.Link onClick={() => closeNavbar()} className='text-light text-center bg-danger rounded' as={NavLink} to="/logout" exact="true">Logout</Nav.Link>
                            </Nav>
                        </>
                        :
                        <>
                            <Nav className="ms-auto">
                                <Nav.Link onClick={() => closeNavbar()} className='text-light' as={NavLink} to="/login" exact="true">Login</Nav.Link>
                            </Nav>
                            <Nav>
                                <Nav.Link onClick={() => closeNavbar()} className='text-light' as={NavLink} to="/register" exact="true">Register</Nav.Link>
                            </Nav>
                        </>
                    }
                   
                  
                </Navbar.Collapse>
            </Container>
        </Navbar>
  );
}
