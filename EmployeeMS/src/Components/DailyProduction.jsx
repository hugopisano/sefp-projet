import axios from 'axios';
import React, { useEffect, useState } from 'react'

const DailyProduction = () => {
    const [dailyProductionData, setDailyProductionData] = useState([])

    useEffect(() => {
        const fetchDailyProduction = async () => {
            try {
                const response = await axios.get('http://localhost:3000/auth/daily_production');
                if (response.data.Status) {
                    // Stockez les données dans l'état du composant
                    setDailyProductionData(response.data.Data);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des données", error);
            }
        };

        fetchDailyProduction();
    }, []);

    return (
        <>
            <div className='bg-white rounded-lg shadow-md p-4 flex flex-col w-3/4'>
                <div className="relative overflow-x-auto sm:rounded-lg w-full">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-900">
                        <thead className="text-xs text-black uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Nom</th>
                                <th scope="col" className="px-6 py-3">Prénom</th>
                                <th scope="col" className="px-6 py-3">Date Dernière Production</th>
                                <th scope="col" className="px-6 py-3">Total Produit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dailyProductionData.map((item, index) => (
                                <tr key={index} className="odd:bg-white even:bg-gray-50 border-b">
                                    <td className="px-6 py-4">{item.nom}</td>
                                    <td className="px-6 py-4">{item.prenom}</td>
                                    <td className="px-6 py-4">{item.lastAssignedDate}</td>
                                    <td className="px-6 py-4">{item.totalProduced}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <nav className="flex justify-between pt-4 items-baseline h-16">
                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                            Affichage 1-10 of 50
                        </span>
                        <ul className="inline-flex items-center -space-x-px no-underline mb-0">
                            <li>
                                <a href="#" className="px-3 py-2 border border-gray-300 text-gray-500 rounded-l-lg hover:bg-gray-100 dark:text-gray-400 no-underline">
                                    Précédent
                                </a>
                            </li>
                            {/* Exemple de numéros de page */}
                            {[1, 2, 3, 4, 5].map(page => (
                                <li key={page}>
                                    <a href="#" className={`px-3 py-2 border border-gray-300 text-gray-500 hover:bg-gray-100 dark:text-gray-400 no-underline ${page === 3 ? 'bg-blue-500 hover:bg-blue-900 text-white' : ''}`}>
                                        {page}
                                    </a>
                                </li>
                            ))}
                            <li>
                                <a href="#" className="px-3 py-2 border border-gray-300 text-gray-500 rounded-r-lg hover:bg-gray-100 dark:text-gray-400 no-underline">
                                    Suivant
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
            <div className="flex flex-col w-1/4 gap-3">
                <div className='bg-white rounded-lg shadow-md p-4 flex flex-row w-full'>
                    <div className="relative overflow-x-auto sm:rounded-lg w-full">
                    </div>
                </div>
                <div className='bg-white rounded-lg shadow-md p-4 flex flex-row w-full'>
                    <div className="relative overflow-x-auto sm:rounded-lg w-full">
                    </div>
                </div>
            </div>
        </>

    )
}

export default DailyProduction