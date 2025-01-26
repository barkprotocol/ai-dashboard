"use client";

import React from 'react'
import Link from 'next/link'

export default function ProfilePage() {
  const user = {
    name: "John Doe",
    email: "johndoe@example.com",
    profilePicture: "https://ucarecdn.com/9972a31f-210a-4f99-bf66-0022cd9a9107/Barker1.png",
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-4">Profile Page</h1>
      <div className="flex items-center space-x-4">
        <img
          src={user.profilePicture}
          alt={user.name}
          className="w-24 h-24 rounded-full object-cover"
        />
        <div>
          <h2 className="text-xl font-semibold">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-medium">Account Settings</h3>
        <ul className="list-disc pl-5 mt-2">
          <li>
            <button className="text-blue-500 hover:underline">Edit Profile</button>
          </li>
          <li>
            <button className="text-blue-500 hover:underline">Change Password</button>
          </li>
          <li>
            <button className="text-blue-500 hover:underline">Log Out</button>
          </li>
        </ul>
      </div>

      {/* Add Navigation Link to AI Trading Page */}
      <div className="mt-4">
        <Link href="/dashboard/trading/ai-trading">
          <a className="text-blue-500 hover:underline">Go to AI Trading</a>
        </Link>
      </div>
    </div>
  )
}
