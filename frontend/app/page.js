'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function Home() {
  const [reports, setReports] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalImageUrl, setModalImageUrl] = useState('')

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get('http://localhost:7777/')
        setReports(response.data)
      } catch (error) {
        console.error('Error fetching reports:', error)
      }
    }

    fetchReports()
  }, [])

  const handleImageClick = (imageUrl) => {
    setModalImageUrl(imageUrl)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full">
        {reports.map((report) => (
          <div
            key={report._id}
            className="border border-black my-4 p-4 bg-white rounded-md"
          >
            <img
              src={report.image}
              alt="Report Image"
              className="w-32 h-32 object-cover rounded-md border-2 border-orange-500 cursor-pointer"
              onClick={() => handleImageClick(report.image)}
            />
            <p className="text-black mt-4">{report.description}</p>
            <p className="text-green-500">
              {new Date(report.date).toLocaleDateString()}
            </p>
            <p className="text-orange-500">ID: {report._id}</p>
          </div>
        ))}
      </div>
      {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg relative">
            {' '}
            {/* 'relative' remains unchanged for absolute positioning of the close button */}
            <button
              onClick={closeModal}
              className="text-white bg-black p-2 text-4xl rounded-full shadow-lg absolute top-10 right-10"
            >
              &times;
            </button>
            <img
              src={modalImageUrl}
              alt="Full-size report"
              className="max-w-full h-auto"
            />
          </div>
        </div>
      )}
    </main>
  )
}
