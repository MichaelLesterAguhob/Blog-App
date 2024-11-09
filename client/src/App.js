
import { useState, useEffect} from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {UserProvider} from './UserContext';

import './App.css';
import NavBar from './components/NavBar';
import Register from './pages/Register';
import Login from './pages/Login';
import Logout from './components/Logout';
import Footer from './components/Footer';
import Posts from './pages/Posts';

function App() {
  
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({
        _id: null,
        isAdmin: null
    })

    function unsetUser() {
        localStorage.clear();
    }

    
    useEffect(() => {
        const fetchData = async () => {
            try {
                if(localStorage.getItem('token') !== null) {
                   const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
                        headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
                    })
                    
                    if(!response.ok) {
                        let respo = await response.json();
                        throw new Error(respo.message || respo.error || "Getting user details failed")
                    }
                    
                    const data = await response.json();
                    if(data) {
                        setUser({
                            _id: data.user._id,
                            isAdmin: data.user.isAdmin
                        })
                    }
                } else {
                    setUser({
                        _id: null,
                        isAdmin: null
                    })
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(true);
            }
        }
        fetchData();
    }, [])
   
    if(!loading) {
        return (
            <div>Loading data</div>
        )
    }
  
    return (
        <UserProvider value={{user, unsetUser, setUser}}>
            <Router>
                <NavBar />
                <Container className='main-container' fluid>
                    <Routes>
                        <Route path='/' element={<Posts />}/>
                        <Route path='/register' element={<Register />}/>
                        <Route path='/login' element={<Login />}/>
                        <Route path='/logout' element={<Logout />}/>
                    </Routes>
                </Container>
                <Footer />
            </Router>
        </UserProvider>
  );
}

export default App;
