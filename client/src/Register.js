import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import axios from "axios";
import default_pic from './default.png'
import './General.css';
import './Login.css';

const RegisterComponent = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        username: "",
        password: "",
        picture: "",
    });
    const [confPassword, setConfPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [usernames, setUsernames] = useState([]);
    const [users, setUsers] = useState([]);
    const [image, setImage] = useState(null);
    const [uploadingImg, setUploadingImg] = useState(false);
    const [imagePreview, setImagePreview] = useState(false);

    const [imageSelected, setImageSelected] = useState("");

    useEffect(() => {
        axios
            .get("/users")
            .then((res) => {
                setUsers(res.data);
                console.log(res.data);
                var temp_arr = []
                for (var i = 0; i < res.data.length; i++) {
                    console.log(`Username ${i+1} ${res.data[i].username}`);
                    temp_arr.push(res.data[i].username);
                }
                setUsernames(temp_arr);
                console.log("Check temp_arr: " + temp_arr);
                console.log(usernames);
            })
            .catch((err) => {
                console.log("Error in Retrieving Users");
                console.log(err)});
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setUser((prevInput) => {
            return {
                ...prevInput,
                [name]: value,
            };  
        });
    };

    async function uploadImage() {
        const data = new FormData(); // upload the image to cloudinary, which is an API
        data.append('file', image)
        data.append('upload_preset', 'msnqmrlg') // change this 17bcejcu to your preset

        try {
            setUploadingImg(true);
            let res = await fetch("https://api.cloudinary.com/v1_1/dvkljvr6b/image/upload", {
                method: 'post',
                body: data,
            })
            const urlData = await res.json();
            console.log(`URL DATA: ${urlData}`);
            setUploadingImg(false);
            return urlData.url
        } catch (error) {
            setUploadingImg(false);
            console.log(error);
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        console.log(`Username: ${user.username} -- Password: ${user.password}`);
        console.log(`Users: ${usernames}`)

        if (usernames.includes(user.username)) {
            setErrorMessage("Existing Username. Try another username");
        } else {
            console.log("Username did not found")
            if(!image) return alert("Please upload your profile picture");
            const url = await uploadImage(image)
            setUser((prevInput) => {
                return {
                    ...prevInput,
                    picture: url,
                };  
            });
            console.log(`URL: ${url}`);
            
            
            console.log(`User URL: ${user.picture}`);
                axios
                .post('/register', {
                    username: user.username,
                    password: user.password,
                    picture: url
                })
                .then((res) => console.log(res))
                .catch((err) => console.log(err))
            navigate(-1);
            
        }
        
    }
    
    const checkConfPass = (event) => {
        const { name, value } = event.target;

        // what we are typing is being stored to the useState
        setConfPassword((prevInput) => {
            if (user.password != value) {
                setErrorMessage("The passwords do not match");
            }
            else {
                setErrorMessage("");
            }
            return {
                ...prevInput,
                [name]: value,
            };
        });
        
    };

    const validateImg = (event) => {
        const file = event.target.files[0];
        if(file.size > 1048576) { // 1MB
            return alert("Max file size is 1MB");
        } else {
            setImage(file);
            setImagePreview(URL.createObjectURL(file))
        }
    }

    return (
        <div className='container' style={{width: "500px"}}>
            <div className="title">
                <h1>Register Account</h1>
            </div>
            
            <div className="form-container">
                <Form>
                    <Form.Group>
                        <div className='signup-profile-pic__container'>
                            <img 
                                src={imagePreview || default_pic} 
                                className='signup-profile-pic'/>
                            <label htmlFor="image-upload" className='image-upload-label'>
                                <i className="bi bi-plus-circle-fill"></i>
                            </label>
                            <input type="file" id="image-upload" hidden accept="image/png, image/jpeg, image/jpg" onChange={validateImg} />
                        </div>
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

                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            required
                            type="password"
                            placeholder="Password"
                            name='conf-password'
                            onChange={checkConfPass}
                            />

                        {errorMessage && <p className="errorMessage">{errorMessage}</p>}
                    </Form.Group>
                    
                </Form>
                <div className='buttonContainer'>
                    <Button 
                        variant="outline-dark" 
                        className="registerBtn"
                        onClick={handleSubmit}
                        >Register
                    </Button>

                    <NavLink to={"/"}>
                        <Button 
                            className="back-button"
                            >Back</Button>
                    </NavLink>
                </div>
                
                
                
            </div>
            
        </div>
    );
}

export default RegisterComponent;