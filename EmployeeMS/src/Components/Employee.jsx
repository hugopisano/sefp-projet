import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

const Employee = () => {
  const [data, setData] = useState([])
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3000/auth/employee')
      .then(res => {
        if (res.status === 200) {
          setData(res.data.Result);
        } else {
          alert("Error")
        }
      })
      .catch(err => console.log(err));
  }, [])

  const handleDelete = (id) => {
    axios.delete('http://localhost:3000/auth/delete_employee/' + id)
      .then(result => {
        console.log(result)
        if (result.status === 200) {
          window.location.reload();
        } else {
          alert(result.data.Error)
        }
      })
  }

  return (
    <div className='px-5 mt-3'>
      <div className="d-flex justify-end w-full">
        <Link to="/dashboard/add_employee" className='text-white bg-[#F6941C] px-4 py-2 rounded-xl no-underline'>
          + Ajouter
        </Link>
      </div>
      <div className="mt-3">
        <table className="table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Prenom</th>
              <th>Immatriculation</th>
            </tr>
          </thead>
          <tbody>
            {
              data.map(e => (
                <tr key={e.id}>
                  <td>{e.nom}</td>
                  <td>{e.prenom}</td>
                  <td>{e.immatriculation}</td>
                  <td>
                    <Link to={`/dashboard/edit_employee/` + e.id} className='btn btn-info btn-sm me-2 text-white'>Modifier</Link>
                    <button className='btn btn-warning btn-sm text-white' onClick={() => handleDelete(e.id)}>Supprimer</button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Employee