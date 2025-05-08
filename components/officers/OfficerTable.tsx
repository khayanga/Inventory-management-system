import { Officer } from '@prisma/client'
import React from 'react'

interface OfficerTableProps {
   officers:(Officer &{
    checkouts:{
        weapon:{
            serialNumber:string
        }
    }[];
    })[]
   }
const OfficerTable = ({officers}:OfficerTableProps) => {
  return (
    <div className='border rounded-lg overflow-hidden mt-5 max-w-7xl mx-auto'>
        <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
            <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Military ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned Weapons</th> */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
            {officers.map((officer) => (
                <tr key={officer.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{officer.militaryId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{officer.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{officer.rank}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{officer.unit}</td>
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {officer.checkouts.map((checkout) => (
                            <div key={checkout.weapon.serialNumber}>{checkout.weapon.serialNumber}</div>
                        ))}
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {/* Add action buttons here */}
                        <button className="text-blue-500 hover:text-blue-700">Edit</button>
                        <button className="text-blue-500 hover:text-blue-700">Assign</button>
                        <button className="text-red-500 hover:text-red-700 ml-4">Delete</button>
                        
                    </td>
                </tr>
            ))}
        </tbody>

        </table>
    </div>
  )
}

export default OfficerTable