import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddEmployee = () => {
    const [data, setData] = useState({
        nom: '',
        prenom: '',
        immatriculation: '',
    })
    const navigate = useNavigate()

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:3000/auth/add_employee', data)
            .then(res => {
                navigate('/dashboard/employee')
            })
            .catch(err => console.log(err));
    }

    return (
        <div className='d-flex flex-column align-items-center pt-4'>
            <h2>Add Employee</h2>
            <form className="row g-3 w-50" onSubmit={handleSubmit}>
                <div className="col-12">
                    <label htmlFor="nom" className="form-label">Name</label>
                    <input type="text" className="form-control" id="nom" placeholder='Enter Nom' autoComplete='off'
                        onChange={e => setData({ ...data, nom: e.target.value })} />
                </div>
                <div className="col-12">
                    <label htmlFor="prenom" className="form-label">Firstname</label>
                    <input type="text" className="form-control" id="prenom" placeholder='Enter Prenom' autoComplete='off'
                        onChange={e => setData({ ...data, prenom: e.target.value })} />
                </div>
                <div className="col-12">
                    <label htmlFor="immatriculation" className="form-label">Immatriculation</label>
                    <input type="text" className="form-control" id="immatriculation" placeholder='Enter Immatriculation' autoComplete='off'
                        onChange={e => setData({ ...data, immatriculation: e.target.value })} />
                </div>
                <div className="col-12">
                    <button type="submit" className="btn btn-primary">Create</button>
                </div>
            </form>
        </div>
    )
}

export default AddEmployee