import React, { useState, useEffect } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar, Pie } from 'react-chartjs-2'
import { faker } from '@faker-js/faker'
import axios from 'axios'
import { PieController, ArcElement, Color } from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PieController,
  ArcElement,
)

const Data = () => {
  const [reports, setReports] = useState([])

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

  const incidentsByDate = reports.reduce((acc, report) => {
    const date = new Date(report.date).toLocaleDateString()
    acc[date] = (acc[date] || 0) + 1
    console.log('incidents by date, acc', acc)
    return acc
  }, {})

  const incidentsByLocation = reports.reduce((acc, report) => {
    acc[report.location] = (acc[report.location] || 0) + 1
    return acc
  }, {})

  const incidentsBySubmittedBy = reports.reduce((acc, report) => {
    acc[report.submittedBy] = (acc[report.submittedBy] || 0) + 1
    return acc
  }, {})

  const openIncidents = reports.filter((r) => r.resolved === 'N').length
  const closedIncidents = reports.length - openIncidents

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chart.js Bar Chart',
      },
    },
  }

  const labels = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
  ]

  const data = {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Dataset 2',
        data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-gray-200">
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
      <div className="flex flex-wrap justify-center w-full gap-8">
        <div className="w-1/4">
          <Bar
            data={{
              labels: Object.keys(incidentsByDate),
              datasets: [
                {
                  label: 'Incidents by Date',
                  data: Object.values(incidentsByDate),
                  backgroundColor: '#2c7f86',
                },
              ],
            }}
          />
        </div>
        <div className="w-1/4">
          <Pie
            data={{
              labels: ['Open', 'Closed'],
              datasets: [
                {
                  data: [openIncidents, closedIncidents],
                  backgroundColor: ['#2c7f86', 'red'],
                },
              ],
            }}
          />
        </div>
        <div className="w-1/4">
          <Bar
            data={{
              labels: Object.keys(incidentsByLocation),
              datasets: [
                {
                  label: 'Incidents by Location',
                  data: Object.values(incidentsByLocation),
                  backgroundColor: '#2c7f86',
                },
              ],
            }}
          />
        </div>
        <div className="w-1/4">
          <Bar
            data={{
              labels: Object.keys(incidentsBySubmittedBy),
              datasets: [
                {
                  label: 'Incidents by Submitted By',
                  data: Object.values(incidentsBySubmittedBy),
                  backgroundColor: '#2c7f86',
                },
              ],
            }}
          />
        </div>
      </div>
    </main>
  )
}

export default Data
