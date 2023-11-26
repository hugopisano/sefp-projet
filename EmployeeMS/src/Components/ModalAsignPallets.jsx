import axios from 'axios';
import React, { useEffect, useState } from 'react'

const ModalAsignPallets = ({ title, post, value, openModal, closeModal }) => {
    const [asignEmployee, setAsignEmployee] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('')
    const [selectedLength, setSelectedLength] = useState('');
    const [selectedWidth, setSelectedWidth] = useState('');
    const [selectedWoodType, setSelectedWoodType] = useState('');
    const [checkboxOptions, setCheckboxOptions] = useState({
        seul: false,
        melangeAvecChene: false,
        melangeSansChene: false
    });


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
    }, [post])

    const handleCheckboxChange = (e) => {
        setCheckboxOptions({
            ...checkboxOptions,
            [e.target.value]: e.target.checked
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Pour éviter le rechargement de la page

        const selectedOptions = Object.entries(checkboxOptions)
            .filter(([key, value]) => value)
            .map(([key]) => key)
            .join(', ');

        const data = {
            employeeId: selectedEmployee,
            length: selectedLength,
            width: selectedWidth,
            woodType: selectedWoodType,
            additionalOptions: selectedOptions,
            postId: post
        };

        try {
            const response = await axios.post('http://localhost:3000/auth/record_pallet', data);
            if (response.data.Status) {
                // Traitement en cas de succès, par exemple, fermer le modal
                closeModal();
            } else {
                // Gérer les cas où l'API renvoie un statut d'erreur
                alert("Erreur lors de l'enregistrement des données");
            }
        } catch (error) {
            // Gérer les erreurs de requête
            console.error("Erreur lors de l'envoi des données", error);
            alert("Erreur lors de la communication avec le serveur");
        }
    };


    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-60 overflow-y-auto h-full w-full d-flex justify-center items-center">
            <div className="relative mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3 text-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 text-left mb-4">{title}</h3>
                </div>
                <form onSubmit={handleSubmit}>
                    {/* Votre formulaire ici */}
                    <div className="mb-4">
                        {/* Selecteur employé */}
                        <select
                            name="employee"
                            id="employeeSelector"
                            onChange={(e) => setSelectedEmployee(e.target.value)}
                            className='bg-gray-50 border border-[#E2E8F0] text-black text-sm rounded-lg block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black'>
                            <option>Assigner un employé</option>
                            {asignEmployee.map((employee) => (
                                <option key={employee.id} value={employee.id}>
                                    {employee.prenom} {employee.nom}
                                </option>
                            ))}
                        </select>
                        {/* Selecteur : longueur */}
                        <select
                            id="longeur"
                            onChange={(e) => setSelectedLength(e.target.value)}
                            className='bg-gray-50 border mt-4 border-[#E2E8F0] text-black text-sm rounded-lg block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black'>
                            <option value="">Selectionner une longueur</option>
                            <option value="25">25 cm</option>
                            <option value="33">33 cm</option>
                            <option value="40">40 cm</option>
                            <option value="50">50 cm</option>
                            <option value="50XL">50 XL</option>
                            <option value="40XL">40 XL</option>
                            <option value="33XL">33 XL</option>
                            <option value="33-2S">33 cm (2stères)</option>
                        </select>
                        {/* Selecteur : Taille palette */}
                        <select
                            id="pallets-width"
                            onChange={(e) => setSelectedWidth(e.target.value)}
                            className='bg-gray-50 border mt-4 border-[#E2E8F0] text-black text-sm rounded-lg block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black'>
                            <option value="">Selectionner une taille</option>
                            <option value="44">44</option>
                            <option value="46">46</option>
                            <option value="48">48</option>
                            <option value="52">52</option>
                            <option value="56">56</option>
                        </select>
                        {/* Selecteur : Type bois */}
                        <select
                            id="type-essence"
                            onChange={(e) => setSelectedWoodType(e.target.value)}
                            className='bg-gray-50 border mt-4 border-[#E2E8F0] text-black text-sm rounded-lg block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black'>
                            <option value="">Selectionner une essence</option>
                            <option value="Charme">Charme</option>
                            <option value="Chêne">Chêne</option>
                            <option value="Frêne">Frêne</option>
                            <option value="Hêtre">Hêtre</option>
                        </select>
                        <fieldset className='mt-4'>
                            <legend className="sr-only">Checkbox variants</legend>

                            <div className="flex items-center mb-2">
                                <input
                                    id="seul"
                                    type="checkbox"
                                    value="seul"
                                    checked={checkboxOptions.seul}
                                    onChange={handleCheckboxChange}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                />
                                <label htmlFor="seul" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Seul</label>
                            </div>

                            <div className="flex items-center mb-2">
                                <input
                                    id="melangeAvecChene"
                                    type="checkbox"
                                    value="melangeAvecChene"
                                    checked={checkboxOptions.melangeAvecChene}
                                    onChange={handleCheckboxChange}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                />
                                <label htmlFor="melangeAvecChene" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Mélange avec chêne</label>
                            </div>

                            <div className="flex items-center mb-2">
                                <input
                                    id="melangeSansChene"
                                    type="checkbox"
                                    value="melangeSansChene"
                                    checked={checkboxOptions.melangeSansChene}
                                    onChange={handleCheckboxChange}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                />
                                <label htmlFor="melangeSansChene" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Mélange sans chêne</label>
                            </div>
                        </fieldset>
                        <button className="px-4 py-2 bg-indigo-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300">
                            Ajouter
                        </button>
                    </div>
                </form>
                {/* <div className="items-start py-3">
                    <button onClick={closeModal} className="px-4 py-2 bg-indigo-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300">
                        Ajouter
                    </button>
                </div> */}
            </div >
        </div >
    )
}

export default ModalAsignPallets