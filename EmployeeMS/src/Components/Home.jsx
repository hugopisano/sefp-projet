import React, { useEffect, useState } from 'react'
import Card from './Card';
import DailyProduction from './dailyProduction';
import axios from 'axios';

const Home = () => {
  const [totalProducedToday, setTotalProducedToday] = useState(0);

  useEffect(() => {
    axios.get('http://localhost:3000/auth/total_pallets_today')
      .then(response => {
        if(response.data.Status) {
          setTotalProducedToday(response.data.Data[0].totalProducedToday)
        }
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des données', error);
      });
  }, []);

  return (
    <div className='bg-[#f9fafc]'>
      <div className="d-flex space-x-6 pt-6 px-8">
        <Card
          // icon={<YourIconComponent />}
          icon=
          {<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="48" height="48" rx="12" fill="#FFFBEB" />
          </svg>
          }
          title="Total de palettes du jour"
          value={totalProducedToday}
          change=""
        />
        {/* <Card
          icon=
          {
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="48" height="48" rx="12" fill="#EFF6FF" />
            </svg>
          }
          title="Durée Moyenne/Palette"
          value=""
          change=""
        />
        <Card
          icon=
          {
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="48" height="48" rx="12" fill="#FDF2F8" />
            </svg>
          }
          title="Efficacité Globale du jour"
          value=""
          change=""
        /> */}
        {/* Repeat for the other cards */}
      </div>
      <div className="d-flex space-x-6 py-6 px-8">
        <DailyProduction />
      </div>
    </div>
  )
}

export default Home