import axios from 'axios';
import React, { useState } from 'react'
import '../index.css';
import { useNavigate } from 'react-router-dom';
import '../styles/styleLogin.css';

const LoginEmployee = () => {
    const [values, setValues] = useState({
        email: 'employes@sefp.fr',
        password: '0000',
    });
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    axios.defaults.withCredentials = true;

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:3000/auth/adminlogin', values)
            .then(result => {
                if (result.data.loginStatus) {
                    localStorage.setItem("validEmployee", true)
                    navigate('/tablette')
                } else {
                    setError(result.data.Error)
                }
            })
            .catch(error => console.log(error))
    }

    return (
        <div className="bg-white-100 flex justify-center items-center h-screen">
            <div className="lg:py-32 lg:px-40 md:p-52 sm:20 p-12 w-full lg:w-1/2">
                <h1 className="text-2xl font-semibold mb-3 text-center">Connectez-vous à votre compte.</h1>
                <p className='text-1xl font-normal mb-8 text-[#64748B] text-center'>Content de vous revoir! Veuillez entrer vos informations.</p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                    <input type="email" name="email" autoComplete='false' id="email" placeholder='E-mail' className='w-full border border-gray-300 rounded-md py-3 px-3 focus:outline-none focus:border-blue-500' onChange={(e) => setValues({ ...values, email: e.target.value })} value={'employes@sefp.fr'}/>
                    </div>
                    <div className="text-danger mt-2 mb-4">
                        {error && error}
                    </div>
                    <button type="submit" className="bg-[#F6941C] hover:bg-[#e79839] text-white font-semibold rounded-2xl py-3 px-4 w-full">Se connecter</button>
                </form>
            </div>
        </div>
    )
}

export default LoginEmployee