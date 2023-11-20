import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate()
    useEffect(() => {
        setTimeout(() => {
            navigate('/')
        }, "3500");
    }, [])
    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden py-6 sm:py-12 bg-white">
            <div className="max-w-xl px-5 text-center">
                <h2 className="mb-2 text-[42px] font-bold text-zinc-800">Déconnexion Réussie</h2>
                <p className="mb-2 text-lg text-zinc-500">Vous avez été déconnecté(e) avec succès du tableau d'administration.</p>
                <a href="/" className="mt-3 inline-block w-96 rounded bg-[#F6941C] hover:bg-[#e79839] px-5 py-3 font-medium text-white shadow-md shadow-indigo-500/20">Se connecter →</a>
            </div>
        </div>
    )
}

export default Logout