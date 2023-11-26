import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Card from './Card';

const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'nom', headerName: 'Nom', width: 150 },
    { field: 'prenom', headerName: 'Prénom', width: 150 },
    { field: 'length', headerName: 'Longueur', width: 110 },
    { field: 'width', headerName: 'Largeur', width: 110 },
    { field: 'wood_type', headerName: 'Type de Bois', width: 130 },
    { field: 'date_assigned', headerName: 'Date', width: 200 },
    // Autres champs selon la structure de votre table
];

const Poste = () => {
    const [rows, setRows] = useState([]);
    const [postes, setPostes] = useState([]); // Stocker les postes ici
    const [selectedPoste, setSelectedPoste] = useState(1);
    const [countDay, setCountDay] = useState(0);
    const [countWeek, setCountWeek] = useState(0);
    const [countMonth, setCountMonth] = useState(0);
    const [countYear, setCountYear] = useState(0);

    useEffect(() => {
        const fetchPosteData = () => {
            axios.get(`http://localhost:3000/auth/pallets_data/${selectedPoste}`)
                .then(res => {
                    if (res.status === 200) {
                        setRows(res.data.Data);
                    } else {
                        alert("Error")
                    }
                })
                .catch(err => console.log(err));
        }

        const fetchPalletsCountDay = () => {
            axios.get(`http://localhost:3000/auth/pallets_count/day/${selectedPoste}`)
                .then(res => {
                    if (res.status === 200) {
                        setCountDay(res.data.Data[0]['COUNT(*)']);
                    } else {
                        alert("Error")
                    }
                })
                .catch(err => console.log(err));
        }

        const fetchPalletsCountWeek = () => {
            axios.get(`http://localhost:3000/auth/pallets_count/week/${selectedPoste}`)
                .then(res => {
                    if (res.status === 200) {
                        setCountWeek(res.data.Data[0]['COUNT(*)']);
                    } else {
                        alert("Error")
                    }
                })
                .catch(err => console.log(err));
        }

        const fetchPalletsCountMonth = () => {
            axios.get(`http://localhost:3000/auth/pallets_count/month/${selectedPoste}`)
                .then(res => {
                    if (res.status === 200) {
                        setCountMonth(res.data.Data[0]['COUNT(*)']);
                    } else {
                        alert("Error")
                    }
                })
                .catch(err => console.log(err));
        }

        const fetchPalletsCountYear = () => {
            axios.get(`http://localhost:3000/auth/pallets_count/year/${selectedPoste}`)
                .then(res => {
                    if (res.status === 200) {
                        setCountYear(res.data.Data[0]['COUNT(*)']);
                    } else {
                        alert("Error")
                    }
                })
                .catch(err => console.log(err));
        }

        fetchPosteData();
        fetchPalletsCountDay();
        fetchPalletsCountWeek()
        fetchPalletsCountMonth()
        fetchPalletsCountYear()
    }, [selectedPoste])

    const handlePosteChange = (event) => {
        setSelectedPoste(event.target.value);
    };

    return (
        <div className='px-5 mt-3'>
            <section className="w-full flex items-center gap-3 mb-4">
                <Card
                    icon=
                    {<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="48" height="48" rx="12" fill="#FFFBEB" />
                    </svg>
                    }
                    title="Total de palettes/jour"
                    value={countDay}
                    change=""
                />
                <Card
                    icon=
                    {<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="48" height="48" rx="12" fill="#EFF6FF" />
                    </svg>
                    }
                    title="Total de palettes/semaine"
                    value={countWeek}
                    change=""
                />
                <Card
                    icon=
                    {<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="48" height="48" rx="12" fill="#FDF2F8" />
                    </svg>
                    }
                    title="Total de palettes/mois"
                    value={countMonth}
                    change=""
                />
                <Card
                    icon=
                    {<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="48" height="48" rx="12" fill="#E6FFFA" />
                    </svg>
                    }
                    title="Total de palettes/année"
                    value={countYear}
                    change=""
                />

            </section>
            <FormControl style={{ marginBottom: '20px', width: '25%' }}>
                <InputLabel id="poste-label">Sélectionner un Poste</InputLabel>
                <Select
                    labelId="poste-label"
                    id="poste-select"
                    value={selectedPoste}
                    label="Sélectionner un Poste"
                    onChange={handlePosteChange}
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block'
                >
                    <MenuItem key={1} value={1}>Poste 1</MenuItem>
                    <MenuItem key={2} value={2}>Poste 2</MenuItem>
                    <MenuItem key={3} value={3}>Poste 3</MenuItem>
                    <MenuItem key={4} value={4}>Poste 4</MenuItem>
                    <MenuItem key={5} value={5}>Poste 5</MenuItem>
                    <MenuItem key={6} value={6}>Poste 6</MenuItem>
                </Select>
            </FormControl>

            <div style={{ height: 800, width: '100%', marginBottom: 60 }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 20 },
                        },
                    }}
                    pageSizeOptions={[20, 50, 100]}
                    checkboxSelection
                />
            </div>
        </div>
    );
}

export default Poste