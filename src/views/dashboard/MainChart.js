import React, { useEffect, useRef, useState } from 'react'

import { CChartLine } from '@coreui/react-chartjs'
import { getStyle } from '@coreui/utils'
import { getRequest } from '../../Services/apiMethods'

const MainChart = () => {
  const [salesData, setSalesData] = useState([])

  useEffect(() => {
    const fetchSalesData = async () => {
      const token = localStorage.getItem('token')
      try {
        const response = await getRequest('/dashboards/total/sales/detail', token)
        if (response?.data) {
          setSalesData(response.data)
        }
      } catch (error) {
        console.error('Error fetching sales data:', error)
      }
    }
    fetchSalesData()
  }, [])

  const chartData = {
    labels: salesData.map(item => item.name),
          datasets: [
            {
        label: 'Sales',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(75, 192, 192, 1)',
        data: salesData.map(item => item.Sales),
              fill: true,
        tension: 0.4,
        borderWidth: 2
      }
    ]
  }

  const chartOptions = {
          maintainAspectRatio: false,
    responsive: true,
          plugins: {
            legend: {
        display: false
            },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `Sales: ${context.raw}`
          }
        }
      }
          },
          scales: {
            x: {
              grid: {
          display: false,
          drawBorder: false
              },
              ticks: {
          color: '#666',
          font: {
            size: 12,
            weight: '500'
          }
        }
            },
            y: {
              beginAtZero: true,
              grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
              },
              ticks: {
          color: '#666',
          font: {
            size: 12,
            weight: '500'
          },
          padding: 10,
          callback: function(value) {
            return value
          }
        }
      }
          },
          elements: {
            line: {
        tension: 0.4
            },
            point: {
        radius: 4,
              hitRadius: 10,
        hoverRadius: 6,
        hoverBorderWidth: 2
      }
    }
  }

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h5>Monthly Sales Overview</h5>
      </div>
      <CChartLine
        style={{ 
          height: '300px', 
          marginTop: '20px',
          padding: '20px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
        data={chartData}
        options={chartOptions}
      />
    </div>
  )
}

// Add these styles to your CSS file or use inline styles
const styles = {
  chartContainer: {
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  chartHeader: {
    marginBottom: '20px',
    color: '#333',
    fontSize: '18px',
    fontWeight: '600'
  }
}

export default MainChart
