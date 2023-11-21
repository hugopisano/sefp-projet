import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Modal = ({ title, post, value, openModal, closeModal }) => {
    const [data, setData] = useState([]);
    const [postFull, setPostFull] = useState(false)
    const [asignEmployee, setAsignEmployee] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:3000/auth/employees_by_post/${post}`)
            .then(response => {
                if (response.data.Status) {
                    setAsignEmployee(response.data.Employees)
                } else {
                    alert(`Erreur lors de l'importation des employés assignés au poste ${post}`)
                }
            })
            .catch(err => console.log(err));

        axios.get(`http://localhost:3000/auth/post_status/${post}`)
            .then(response => {
                if (response.data.PostFull) {
                    setPostFull(true)
                } else {
                    setPostFull(false)
                }
            })
            .catch(err => console.log(err));

        axios.get('http://localhost:3000/auth/unassigned_employees')
            .then(res => {
                if (res.status === 200) {
                    setData(res.data.Result);
                } else {
                    alert("Error")
                }
            })
            .catch(err => console.log(err));
    }, [post])

    const setSelectedEmployee = (e) => {
        const id = Number(e);

        if (postFull) {
            alert('Ce poste est déjà complet.');
            return;
        }

        axios.post('http://localhost:3000/auth/assign_to_post', { id, post })
            .then(res => {
                closeModal()
                setTimeout(() => (
                    openModal()
                ), 500)
            })
            .catch(err => console.log(err));
    }

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-60 overflow-y-auto h-full w-full d-flex justify-center items-center">
            <div className="relative mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3 text-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 text-left">{title}</h3>
                    <div className="m-0">
                        <p className="text-sm text-gray-500 text-left">Vous pouvez modifier les informations ici.</p>
                    </div>
                </div>
                <form>
                    {/* Votre formulaire ici */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="value">
                            Valeur
                        </label>
                        {
                            postFull ? (
                                <p>Le poste est déjà complet.</p>
                            ) : (
                                <select
                                    name="employee"
                                    id="employeeSelector"
                                    onChange={(e) => setSelectedEmployee(e.target.value)}
                                    className='bg-gray-50 border border-[#E2E8F0] text-black text-sm rounded-lg block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black'>
                                    <option>Assigner un employé</option>
                                    {data.map((employee) => (
                                        <option key={employee.id} value={employee.id}>
                                            {employee.prenom} {employee.nom}
                                        </option>
                                    ))}
                                </select>
                            )
                        }
                    </div>
                    <div className="mb-4">
                        <h4 className="text-lg font-medium text-gray-900">Employés assignés au poste :</h4>
                        <ul className="list-disc">
                            {asignEmployee.length > 0 ? (
                                asignEmployee.map((employee) => (
                                    <li key={employee.id}>
                                        {employee.prenom} {employee.nom}
                                    </li>
                                ))
                            ) : (
                                <p>Aucun employé assigné à ce poste.</p>
                            )}
                        </ul>
                    </div>
                    {/* Autres champs de formulaire... */}
                </form>
                <div className="items-start py-3">
                    <button onClick={closeModal} className="px-4 py-2 bg-indigo-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300">
                        Fermer
                    </button>
                </div>
            </div >
        </div >
    );
};

export default Modal;
