import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

const EditEmployee = () => {
    const { id } = useParams()
    const navigate = useNavigate();
    const [data, setData] = useState({
        nom: '',
        prenom: '',
        immatriculation: '',
    })

    useEffect(() => {
        axios.get('http://localhost:3000/auth/employee/' + id)
            .then(result => {
                setData({
                    ...data,
                    nom: result.data.Result[0].nom,
                    prenom: result.data.Result[0].prenom,
                    immatriculation: result.data.Result[0].immatriculation
                })
            })
            .catch(error => {
                console.log(error)
            })
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put('http://localhost:3000/auth/edit_employee/' + id, data)
            .then(result => {
                if (result.status === 200) {
                    navigate('/dashboard/employee')
                } else {
                    alert(result.data.Error)
                }
            })
            .catch(error => {
                console.log(error)
            })
    }

    return (
        <div className='d-flex flex-column align-items-center px-8 pt-4 h-3/4 justify-center'>
            <h2>Mettre à jour les informations de l'employé</h2>
            <form className="row g-3 w-50" onSubmit={handleSubmit}>
                <div className="col-12">
                    <input type="text" className='mt-4 w-full border border-gray-300 rounded-md py-3 px-3 focus:outline-none focus:border-blue-500' id="nom" placeholder='Enter Nom' autoComplete='off'
                        onChange={e => setData({ ...data, nom: e.target.value })} value={data.nom} />
                </div>
                <div className="col-12">
                    <input type="text" className='my-2 w-full border border-gray-300 rounded-md py-3 px-3 focus:outline-none focus:border-blue-500' id="prenom" placeholder='Enter Prenom' autoComplete='off'
                        onChange={e => setData({ ...data, prenom: e.target.value })} value={data.prenom} />
                </div>
                <div className="col-12">
                    <input type="text" className='mb-4 w-full border border-gray-300 rounded-md py-3 px-3 focus:outline-none focus:border-blue-500' id="immatriculation" placeholder='Enter Immatriculation' autoComplete='off'
                        onChange={e => setData({ ...data, immatriculation: e.target.value })} value={data.immatriculation} />
                </div>
                <div className="col-12 text-center">
                    <button type="submit" className='text-white bg-[#F6941C] px-4 py-2 rounded-xl no-underline'>Mettre à jour</button>
                </div>
            </form>
        </div>
    )
}

export default EditEmployee