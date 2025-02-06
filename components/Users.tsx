"use client"
import React from 'react'
import { useRouter } from 'next/navigation';


const Users = ({ users }: { users: { id: string; name: string; email:string }[] }) => {
    const router = useRouter()
  return (
    <div>
        <ul className='py-2'>
            {users.map((user) => (
                <li className='p-2 border' key={user.id}>
                    {user.name}
                    <button
                        className="ml-4 bg-blue-500 text-white px-3 py-1 rounded"
                        onClick={() => router.push(`/users/${user.id}`)}
                    >
                        Edit
                    </button>
                </li>
            ))}
        </ul>
    </div>
  )
}

export default Users