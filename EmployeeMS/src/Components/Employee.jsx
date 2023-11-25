import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

const Employee = () => {
  const [data, setData] = useState([])
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');


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
      <section className="bg-gray-50 w-full flex items-center">
        <div className="mx-auto w-full">
          <div className="relative bg-white shadow-md text-black sm:rounded-lg">
            <div className="flex flex-col items-center justify-between p-4 space-y-3 md:flex-row md:space-y-0 md:space-x-4">
              <div className="w-full md:w-1/2">
                <form className="flex items-center">
                  <label htmlFor="simple-search" className="sr-only">Rechercher...</label>
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    </div>
                    <input type="text" id="simple-search" className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500" placeholder="Rechercher un employé..." required="" value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)} />
                  </div>
                </form>
              </div>
              <div className="flex flex-col items-stretch justify-end flex-shrink-0 w-full space-y-2 md:w-auto md:flex-row md:space-y-0 md:items-center md:space-x-3">
                <Link to="/dashboard/add_employee" className='text-white bg-[#F6941C] px-4 py-2 rounded-xl no-underline'>
                  + Ajouter
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="mt-3">
        <div className="p-4 bg-white shadow-md rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-900">
            <thead className="text-xs text-black uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 w-1/4">Nom</th>
                <th scope="col" className="px-6 py-3 w-1/4">Prénom</th>
                <th scope="col" className="px-6 py-3 w-1/4">Immatriculation</th>
                <th scope="col" className="px-6 py-3 w-[1%]"></th>
                <th scope="col" className="px-6 py-3 w-[1%]"></th>
              </tr>
            </thead>
            <tbody>
              {data.filter(item =>
                item.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.immatriculation.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((item, index) => (
                <tr key={index} className="odd:bg-white even:bg-gray-50 border-b" style={{ verticalAlign: "-webkit-baseline-middle" }}>
                  <td className="py-3 px-6">{item.nom}</td>
                  <td className="py-3 px-6">{item.prenom}</td>
                  <td className="py-3 px-6">{item.immatriculation}</td>
                  <td className="text-center"><Link to={`/dashboard/edit_employee/` + item.id} className='p-2.5 rounded-lg bg-[#8388A4] no-underline btn-sm me-2 text-white'>Modifier</Link></td>
                  <td className="text-center"><button className='p-2 rounded-lg bg-[#ED5E68] btn-sm text-white' onClick={() => handleDelete(e.id)}>Supprimer</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Employee