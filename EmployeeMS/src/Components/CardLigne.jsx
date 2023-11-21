import React, { useEffect, useState } from 'react'
import Modal from './Modal';
import axios from 'axios';
import ModalAsignPallets from './ModalAsignPallets';

const CardLigne = ({ title, post, value }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [isModalPallets, setIsModalPallets] = useState(false);

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleOpenPallets = () => {
        setIsModalPallets(true)
    }

    return (
        <div className="p-4 d-flex w-2/4 h-2/6 justify-center">
            <div className="flex rounded-lg p-4 flex-col bg-white shadow-sm">
                <div className="flex items-center mb-3">
                    <div
                        className="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full dark:bg-indigo-500 bg-indigo-500 text-white flex-shrink-0">
                    </div>
                    <h2 className="text-black dark:text-white text-lg font-medium m-0">{title}</h2>
                </div>
                <div className="flex flex-col justify-between flex-grow">
                    {/* <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-[#E2E8F0]">
                        <div className={`bg-blue-600 h-2.5 rounded-full`} style={{ width: `20%` }}></div>
                    </div> */}
                    <p className="leading-relaxed text-base text-black dark:text-gray-300 w-full opacity-0">
                        Blue bottle crucifix vinyl post-ironic four dollar toast vegan taxidermy. Gastropub indxgo juice poutine.
                    </p>
                    <div className="d-flex gap-8">
                        <a href="#" onClick={handleOpenModal} className="bg-[#E2E8F0] hover:bg-[#c7ccd3] text-black font-semibold rounded-2xl py-3 px-4 w-full no-underline text-center">Modifier
                        </a>
                        <a href="#" onClick={handleOpenPallets} className="bg-[#F6941C] hover:bg-[#e79839] text-white font-semibold rounded-2xl py-3 px-4 w-full no-underline text-center">Ajouter
                        </a>
                    </div>
                    {isModalPallets && <ModalAsignPallets title={title} post={post} value={value} openModal={() => setIsModalPallets(true)} closeModal={() => setIsModalPallets(false)} />}
                    {isModalOpen && <Modal title={title} post={post} value={value} openModal={() => setModalOpen(true)} closeModal={() => setModalOpen(false)} />}
                </div>
            </div>
        </div>

    )
}

export default CardLigne