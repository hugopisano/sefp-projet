import axios from 'axios';
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const Start = () => {
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:3000/verify')
            .then(res => {
                if (res.status === 200) {
                    if (res.data.role === "admin") {
                        navigate('/dashboard')
                    }
                }
            })
            .catch(err => {
                console.log(err)
            })
    }, [])
    return (
        <div>Start</div>
    )
}

export default Start