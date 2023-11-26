import axios from 'axios'
import React from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import Img1 from '../img/logo.png'

const Dashboard = () => {
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    const handleLogout = () => {
        axios.get('http://localhost:3000/auth/logout')
            .then(res => {
                if (res.status === 200) {
                    localStorage.removeItem("valid");
                    navigate('/deconnexion')
                }
            })
    }

    return (
        <div className="container-fluid">
            <div className="row flex-nowrap h-[100%] min-h-[100vh]">
                <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-white shadow-md">
                    <div className="d-flex pb-10 justify-between flex-column align-items-center align-items-sm-start px-6 pt-2 text-black h-full">
                        <a href="/dashboard" className="d-flex align-items-center pb-3 mb-md-1 mt-md-3 me-md-auto text-black text-decoration-none">
                            {/* <span className="fs-5 fw-bolder d-none d-sm-inline">Admin Dashboard</span> */}
                            <img src={Img1} alt="Placeholder Image" className="object-cover w-full h-full" />
                        </a>
                        <ul className="nav mt-14 nav-pills flex-column mb-sm-auto text-left mb-24 align-items-center align-items-sm-start w-full content-center" id="menu">
                            <li className='mb-3 w-full hover:bg-[#F8FAFC] rounded-md pl-5'>
                                <Link to="/dashboard" data-bs-toggle="collapse" className="nav-link text-black px-0 align-middle">
                                    <i className="fs-4 bi-speedometer2"></i> <span className="ms-1 d-none d-sm-inline">Aperçu</span> </Link>
                            </li>
                            <li className='mb-3 w-full hover:bg-[#F8FAFC] rounded-md pl-5'>
                                <Link to="/dashboard/employee" className="nav-link px-0 align-middle text-black">
                                    <i className="fs-4 bi-people"></i> <span className="ms-1 d-none d-sm-inline">Employés</span> </Link>
                            </li>
                            <li className='mb-3 w-full hover:bg-[#F8FAFC] rounded-md pl-5'>
                                <Link to="/dashboard/poste" className="nav-link px-0 align-middle text-black">
                                    <i className="fs-4 bi-person"></i> <span className="ms-1 d-none d-sm-inline">Poste</span></Link>
                            </li>
                            <li className='mb-3 w-full hover:bg-[#F8FAFC] rounded-md pl-5'>
                                <Link to="/dashboard" className="nav-link px-0 align-middle text-black">
                                    <i className="fs-4 bi-person"></i> <span className="ms-1 d-none d-sm-inline">Longueur</span></Link>
                            </li>
                            <li className='mb-3 w-full hover:bg-[#F8FAFC] rounded-md pl-5'>
                                <Link to="/dashboard" className="nav-link px-0 align-middle text-black">
                                    <i className="fs-4 bi-person"></i> <span className="ms-1 d-none d-sm-inline">Taille palette</span></Link>
                            </li>
                            <li className='mb-3 w-full hover:bg-[#F8FAFC] rounded-md pl-5'>
                                <Link to="/dashboard" className="nav-link px-0 align-middle text-black">
                                    <i className="fs-4 bi-person"></i> <span className="ms-1 d-none d-sm-inline">Volume</span></Link>
                            </li>
                        </ul>
                        <ul className="nav nav-pills rounded-md flex-column align-items-center align-items-sm-start w-full content-center hover:bg-[#F8FAFC]" id="menu">
                            <li className='w-full hover:bg-[#F8FAFC] rounded-md pl-5' onClick={handleLogout}>
                                <Link to="/deconnexion" className="nav-link px-0 align-middle text-black">
                                    <i className="fs-4 bi-power"></i> <span className="ms-1 d-none d-sm-inline">Déconnexion</span>
                                </Link>
                            </li>
                            {/* <li onClick={handleLogout}>
                                <a href="#" className="nav-link px-0 align-middle text-black w-full h-full">
                                    <i className="fs-4 bi-power"></i> <span className="ms-1 d-none d-sm-inline">Déconnexion</span>
                                </a>
                            </li> */}
                        </ul>
                    </div>
                </div>
                <div className="col p-0 m-0">
                    <div className='d-flex flex-row h-24 shadow-md px-8 justify-between items-center'>
                        <div className="d-flex flex-col justify-center items-start">
                            <h3 className='font-bold'>Tableau de bord</h3>
                            <p className='text-[#64748B]'>Informations détaillées sur votre entreprise</p>
                        </div>
                    </div>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Dashboard