import React from 'react'
import Card from './Card';
import DailyProduction from './dailyProduction';

const Home = () => {

  return (
    <div className='bg-[#f9fafc]'>
      <div className="d-flex space-x-6 py-6 px-8">
        <Card
          // icon={<YourIconComponent />}
          icon=
          {<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="48" height="48" rx="12" fill="#FFFBEB" />
          </svg>
          }
          title="Total de palettes du jour"
          value="180"
          change="+12%"
        />
        <Card
          icon=
          {
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="48" height="48" rx="12" fill="#EFF6FF" />
            </svg>
          }
          title="Durée Moyenne/Palette"
          value="15min"
          change="-5%"
        />
        <Card
          icon=
          {
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="48" height="48" rx="12" fill="#FDF2F8" />
            </svg>
          }
          title="Efficacité Globale du jour"
          value="90%"
          change="+5%"
        />
        {/* Repeat for the other cards */}
      </div>
      <div className="d-flex space-x-6 py-6 px-8">
        <DailyProduction />
      </div>
    </div>
  )
}

export default Home