'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function Home() {
  const [reports, setReports] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalImageUrl, setModalImageUrl] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [reportsPerPage] = useState(10)

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get('http://localhost:7777/')
        setReports(response.data)
        console.log('reports: ', reports)
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

  const handleResolveIncident = async (id) => {
    try {
      console.log('id: ', id)
      let result = await axios.put(`http://localhost:7777/resolve/${id}`)
      console.log('result: ', result)
    } catch (error) {
      console.error('Error resolving incident:', error)
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const indexOfLastReport = currentPage * reportsPerPage
  const indexOfFirstReport = indexOfLastReport - reportsPerPage
  const currentReports = reports.slice(indexOfFirstReport, indexOfLastReport)

  return (
    <div className="min-h-screen flex flex-col">
      <div
        style={{
          backgroundImage: 'url(./circle-scatter-haikei.svg)',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          position: 'fixed', // this ensures the container covers the entire viewport
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1, // this makes sure it sits behind your content
        }}
      ></div>
      <main className="flex flex-col items-center p-24 w-full overflow-y-auto">
        {/* Header Toolbar with gradient */}
        <header className="w-full p-4 mb-12 shadow-lg flex justify-between items-center bg-gradient-to-r from-gray-100 to-gray-300 rounded-xl border border-gray-400">
          <img
            src="./report_it_icon.png"
            alt="Report It Logo"
            className="max-h-20"
          />
          <div className="space-x-4 mr-12">
            <a
              href="/"
              className="text-black hover:text-white hover:bg-2c7f86 px-4 py-2 rounded transition-colors capitalize"
            >
              INCIDENTS
            </a>
            <a
              href="/data"
              className="text-black hover:text-white hover:bg-2c7f86 px-4 py-2 rounded transition-colors capitalize"
            >
              DATA
            </a>
          </div>
        </header>

        <div className="w-full">
          {currentReports.map((report) => (
            <div
              key={report._id}
              className="flex flex-wrap justify-between my-6 p-6 bg-gradient-to-r from-gray-100 to-gray-300 rounded-lg shadow-lg border border-gray-400"
            >
              <img
                src={report.image}
                alt="Report Image"
                className="w-36 h-36 object-cover rounded-md cursor-pointer mb-4 shadow-xl transform hover:scale-105 transition-transform"
                style={{
                  boxShadow:
                    '4px 4px 10px rgba(0, 0, 0, 0.2), -4px -4px 10px rgba(255, 255, 255, 0.7)',
                }}
                onClick={() => handleImageClick(report.image)}
              />
              <div className="flex-1 ml-6 space-y-2 relative">
                {' '}
                {/* added relative here for absolute positioning of button */}
                <p className="text-black text-lg font-semibold">
                  {report.description}
                </p>
                <p className="text-gray-600 text-md">
                  {new Date(report.date).toLocaleDateString()}
                </p>
                <p className="text-gray-600 font-medium">ID: {report._id}</p>
                <p className="text-gray-600">
                  Submitted By: {report.submittedBy}
                </p>
                <p className="text-gray-600">
                  Incident Location: {report.location}
                </p>
                <p className="text-gray-600">
                  Incident Resolved? {report.resolved}
                </p>
                {/* This button is positioned absolutely to the bottom right of its relative parent */}
                {report.resolved === 'N' && (
                  <button
                    className="absolute bottom-2 right-2  text-white px-4 py-2 rounded"
                    style={{ backgroundColor: '#2c7f86' }}
                    onClick={() => handleResolveIncident(report._id)}
                  >
                    Resolve Incident
                  </button>
                )}
              </div>
            </div>
          ))}
          <div className="mt-8">
            <button
              className="px-4 py-2 border rounded-l text-white"
              onClick={() =>
                setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)
              }
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="px-4 py-2 border-t border-b text-white">
              {currentPage}
            </span>
            <button
              className="px-4 py-2 border rounded-r text-white"
              onClick={() =>
                setCurrentPage(
                  currentPage < Math.ceil(reports.length / reportsPerPage)
                    ? currentPage + 1
                    : currentPage,
                )
              }
              disabled={
                currentPage === Math.ceil(reports.length / reportsPerPage)
              }
            >
              Next
            </button>
          </div>
        </div>
        {isModalOpen && (
          <div
            className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50"
            onClick={closeModal} // Closing modal when background is clicked
          >
            <div
              className="bg-white p-6 rounded-lg relative"
              onClick={(e) => e.stopPropagation()} // Preventing the background click event from bubbling up when the modal content is clicked
            >
              <button
                onClick={closeModal}
                className="text-white bg-black-600 p-3 text-3xl rounded-full shadow-lg absolute top-6 right-6"
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
    </div>
  )
}
