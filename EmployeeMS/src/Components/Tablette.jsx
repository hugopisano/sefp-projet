import React from 'react'
import CardLigne from './CardLigne'

const Tablette = () => {
    return (
        <div className='flex flex-wrap justify-center h-screen'>
            <CardLigne title={"Ligne 1"} post={1} value={"0"} />
            <CardLigne title={"Ligne 2"} post={2} value={"0"} />
            <CardLigne title={"Ligne 3"} post={3} value={"0"} />
            <CardLigne title={"Ligne 4"} post={4} value={"0"} />
            <CardLigne title={"Ligne 5"} post={5} value={"0"} />
            <CardLigne title={"Ligne 6"} post={6} value={"0"} />
        </div>
    )
}

export default Tablette