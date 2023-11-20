import axios from 'axios';
import React, { useState } from 'react'
import '../index.css';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    Checkbox,
    Flex,
    Text,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    Image,
} from '@chakra-ui/react'
import '../styles/styleLogin.css';
import Img1 from '../img/loginPhoto.png'

const Login = () => {
    const [values, setValues] = useState({
        email: '',
        password: '',
    });
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    axios.defaults.withCredentials = true;

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:3000/auth/adminlogin', values)
            .then(result => {
                if (result.data.loginStatus) {
                    localStorage.setItem("valid", true)
                    navigate('/dashboard')
                } else {
                    setError(result.data.Error)
                }
            })
            .catch(error => console.log(error))
    }

    return (
        <div className="bg-white-100 flex justify-center items-center h-screen">
            <div className="w-1/2 h-screen hidden lg:block">
                <img src={Img1} alt="Placeholder Image" className="object-cover w-full h-full" />
            </div>
            <div className="lg:py-32 lg:px-40 md:p-52 sm:20 p-12 w-full lg:w-1/2">
                <h1 className="text-2xl font-semibold mb-3">Connectez-vous à votre compte</h1>
                <p className='text-1xl font-normal mb-8 text-[#64748B]'>Content de te revoir! veuillez entrer vos informations</p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <input type="email" name="email" autoComplete='false' id="email" placeholder='E-mail' className='w-full border border-gray-300 rounded-md py-3 px-3 focus:outline-none focus:border-blue-500' onChange={(e) => setValues({ ...values, email: e.target.value })} />
                    </div>
                    <div className="mb-2">
                        <input type="password" name="password" autoComplete='false' id="password" placeholder='Mot de passe' className='w-full border border-gray-300 rounded-md py-3 px-3 focus:outline-none focus:border-blue-500' onChange={(e) => setValues({ ...values, password: e.target.value })} />
                    </div>
                    <div className="text-danger mt-2 mb-2">
                        {error && error}
                    </div>
                    <div className="d-flex flex-row justify-between mt-4">
                        <div className="mb-4 flex items-center">
                            <input type="checkbox" id="remember" name="remember" className="text-blue-500" />
                            <label htmlFor="remember" className="text-gray-600 ml-2">Se souvenir de moi</label>
                        </div>
                        <div className="mb-6">
                            <a href="#" className="hover:underline text-[#F6941C]">Mot de passe oublié??</a>
                        </div>
                    </div>
                    <button type="submit" className="bg-[#F6941C] hover:bg-[#e79839] text-white font-semibold rounded-2xl py-3 px-4 w-full">Se connecter</button>
                </form>
            </div>
        </div>
    )
}

export default Login