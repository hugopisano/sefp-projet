import React from 'react'

const Card = ({ icon, title, value, change }) => {
    return (
        <div className="bg-white pl-6 pr-16 py-4 rounded-lg shadow-md flex items-center w-1/4">
            <div className="p-2 rounded-ful mr-4">
                {icon}
            </div>
            <div>
                <div className="text-xs font-semibold text-gray-400">{title}</div>
                <div className="d-flex items-center gap-2">
                    <div className="text-lg font-bold">{value}</div>
                    <div className={`text-sm font-semibold ${change.includes('-') ? 'text-red-500' : 'text-green-500'}`}>
                        {change}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Card