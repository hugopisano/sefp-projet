import axios from 'axios';
import React, { useEffect, useState } from 'react'
import BarChart from './BarChart';
import MonthlyProductionChart from './MonthlyProductionChart';

const DailyProduction = () => {
    const [dailyProductionData, setDailyProductionData] = useState([])
    const [data, setData] = useState([]);
    const [period, setPeriod] = useState('week');
    const [selectedMonth, setSelectedMonth] = useState(parseInt(new Date().getMonth()) + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [monthlyData, setMonthlyData] = useState({ employeeOfMonth: null, dailyPallets: [] });

    useEffect(() => {
        const fetchMonthlyData = async () => {
            console.log(`http://localhost:3000/auth/employee_of_the_month_data/${selectedYear}/${selectedMonth}`)
            try {
                const response = await axios.get(`http://localhost:3000/auth/employee_of_the_month_data/${selectedYear}/${selectedMonth}`);
                if (response.data.Status) {
                    setMonthlyData({
                        employeeOfMonth: response.data.EmployeeOfTheMonth,
                        dailyPallets: response.data.DailyPallets
                    });
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des données mensuelles", error);
            }
        };

        fetchMonthlyData();
    }, [selectedMonth, selectedYear]);

    const handleMonthChange = (month) => {
        setSelectedMonth(month + 1);
    };

    const handleYearChange = (year) => {
        setSelectedYear(year);
    };

    const handlePeriodChange = (newPeriod) => {
        setPeriod(newPeriod);
    };

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

        const fetchBarChartData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/auth/stats/pallets/${period}`);
                if (response.data.Status) {
                    // Stockez les données dans l'état du composant
                    setData(response.data.Data);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des données", error);
            }
        };

        fetchDailyProduction();
        fetchBarChartData();
    }, [period]);

    return (
        <>
            <div className='bg-white rounded-lg shadow-md p-4 flex flex-col w-3/4'>
                <div className="relative overflow-x-auto sm:rounded-lg w-full">
                    <h4 className='mb-4'>Production quotidienne par employé</h4>
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-900">
                        <thead className="text-xs text-black uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Nom</th>
                                <th scope="col" className="px-6 py-3">Prénom</th>
                                <th scope="col" className="px-6 py-3">Durée Moyenne/Palette</th>
                                <th scope="col" className="px-6 py-3">Total Produit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dailyProductionData.map((item, index) => (
                                <tr key={index} className="odd:bg-white even:bg-gray-50 border-b">
                                    <td className="py-3 px-6">{item.nom}</td>
                                    <td className="py-3 px-6">{item.prenom}</td>
                                    <td className="py-3 px-6"></td>
                                    <td className="py-3 px-6">{item.totalProduced}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* <nav className="flex justify-between pt-4 items-baseline h-16">
                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                            Affichage 1-10 of 50
                        </span>
                        <ul className="inline-flex items-center -space-x-px no-underline mb-0">
                            <li>
                                <a href="#" className="px-3 py-2 border border-gray-300 text-gray-500 rounded-l-lg hover:bg-gray-100 dark:text-gray-400 no-underline">
                                    Précédent
                                </a>
                            </li>
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
                    </nav> */}
                </div>
            </div>
            <div className="flex flex-col w-1/4 gap-3">
                <div className='bg-white rounded-lg shadow-md p-3 flex flex-row w-full h-full'>
                    <div className="relative overflow-x-auto sm:rounded-lg w-full">
                        <BarChart period={period} onPeriodChange={handlePeriodChange} data={data} />
                    </div>
                </div>
                <div className='bg-white rounded-lg shadow-md p-3 flex flex-row w-full'>
                    <div className="relative overflow-x-auto sm:rounded-lg w-full">
                        {monthlyData.employeeOfMonth && (
                            <MonthlyProductionChart
                                employeeData={monthlyData.employeeOfMonth}
                                productionData={monthlyData.dailyPallets}
                                onMonthChange={handleMonthChange}
                                onYearChange={handleYearChange}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>

    )
}

export default DailyProduction