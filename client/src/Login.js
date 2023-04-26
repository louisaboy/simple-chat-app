import {useState, useEffect} from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import axios from "axios";
import './General.css';
import './Login.css';

const LoginComponent = (props) => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        username: "",
        password: "",
    });
    const [users, setUsers] = useState([])
    const [errorMessage, setErrorMessage] = useState("");
    useEffect (() => {
        axios
            .get("/users")
            .then((res) => {
                setUsers(res.data);
                console.log(res.data)
            })
    }, [])

    const handleChange = (event) => {
        const { name, value } = event.target;

        setUser((prevInput) => {
            return {
                ...prevInput,
                [name]: value,
            };  
        });
    };

    const loginSubmit = (event) => {
        event.preventDefault();

        console.log("clicked login...");
        console.log(`User Logging In: ${user.username} ${user.username}`);
        const foundUser = users.find(u=> u.username === user.username && u.password === user.password);
        console.log(foundUser);
        if(foundUser) {
            console.log("User found...")
            console.log(`${foundUser.username} ${foundUser.password} ${foundUser.picture}`);
            props.onLogin(foundUser);
            navigate(`/chat`);
        } else {
            console.log("User not found...")
            setErrorMessage("Invalid username/password");
        }
    }

    return (
        <div className='container' style={{width:"524px"}}>
            <div className="title">
                <h1>Chat Login</h1>
            </div>
            
            <div className="form-container">
                <Form>
                    <Form.Group>
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="Username"
                            name='username'
                            onChange={handleChange}
                            />
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            required
                            type="password"
                            placeholder="Password"
                            name='password'
                            onChange={handleChange}
                            />
                        {errorMessage && <p className="errorMessage">{errorMessage}</p>}
                    </Form.Group>
                    
                </Form>
                <div className='buttonContainer'>
                    <Button  
                        className="loginBtn"
                        onClick={loginSubmit}
                        >Login</Button>
                    <NavLink to={"/register"}>
                        <Button 
                            variant="outline-dark" 
                            className="registerBtn"
                            >Register</Button>
                    </NavLink>
                </div>
                
                
            </div>
            
        </div>
    );
}

export default LoginComponent;