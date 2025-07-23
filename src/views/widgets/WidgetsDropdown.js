import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'

import {
  CRow,
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CWidgetStatsA,
  CCard,
  CCardBody,
} from '@coreui/react'
import { getStyle } from '@coreui/utils'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import { cilArrowBottom, cilArrowTop, cilOptions } from '@coreui/icons'
import { getRequest } from '../../Services/apiMethods'
import { useNavigate } from 'react-router-dom'
const WidgetsDropdown = (props) => {
  const widgetChartRef1 = useRef(null)
  const widgetChartRef2 = useRef(null)
  const [products, setProducts] = useState([])
  const [outofstock, setOutofstock] = useState([])
  const [income, setIncome] = useState([])
  const [users, setUsers] = useState([])
  const [orders, setOrders] = useState([])
  const navigate = useNavigate()

  const getproductdata = async () => {
    const token = localStorage.getItem('token') // Adjust based on your auth logic
    const response = await getRequest('/dashboards/products', token)
    // console.log('Response', response.data)
    setProducts(response.data)
  }
  const getOutofstock = async () => {
    const token = localStorage.getItem('token') // Adjust based on your auth logic
    const response = await getRequest('/dashboards/out-of-stock', token)
    // console.log('Response', response.data.count)
    setOutofstock(response.data.count)
  }
  const getIncome = async () => {
    const token = localStorage.getItem('token') // Adjust based on your auth logic
    const response = await getRequest('/dashboards/income-detail', token)
    // console.log('Response', response)
    setIncome(response.data)
    // setOutofstock(response.data.count)
  }
  const getUser = async () => {
    const token = localStorage.getItem('token') // Adjust based on your auth logic
    const response = await getRequest('/dashboards/users', token)
    // console.log('Response', response)
    setUsers(response.data)

  }
  const getOrders = async () => {
    const token = localStorage.getItem('token') // Adjust based on your auth logic
    const response = await getRequest('/dashboards/orders', token)
    // console.log('Response', response)
    setOrders(response.data)

  }

  useEffect(() => {
    getproductdata()
    getUser()
    getOrders()
    getOutofstock()
    getIncome()
  }, [])

  useEffect(() => {
    document.documentElement.addEventListener('ColorSchemeChange', () => {
      if (widgetChartRef1.current) {
        setTimeout(() => {
          widgetChartRef1.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-primary')
          widgetChartRef1.current.update()
        })
      }

      if (widgetChartRef2.current) {
        setTimeout(() => {
          widgetChartRef2.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-info')
          widgetChartRef2.current.update()
        })
      }
    })
  }, [widgetChartRef1, widgetChartRef2])

  return (
    <>
      <CRow className={props.className} xs={{ gutter: 4 }}>
        <CCol sm={6} xl={4} xxl={3}>
          <CWidgetStatsA
            className="cursor-pointer"
            onClick={() => navigate('/Products/AllProducts')}
            color="info"
            value={products}
            title="Products"
            chart={
              <CChartBar
                className="mt-3 mx-3"
                style={{ height: '70px' }}
                data={{
                  labels: [
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December',
                  ],
                  datasets: [
                    {
                      label: 'My First dataset',
                      backgroundColor: 'rgba(255,255,255,.2)',
                      borderColor: 'rgba(255,255,255,.55)',
                      data: [78, 81, 80, 45, 34, 12, 40, 85, 65, 23, 12, 98, 34, 84, 67, 82],
                      barPercentage: 0.6,
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    x: {
                      grid: {
                        display: false,
                        drawTicks: false,
                      },
                      ticks: {
                        display: false,
                      },
                    },
                    y: {
                      border: {
                        display: false,
                      },
                      grid: {
                        display: false,
                        drawBorder: false,
                        drawTicks: false,
                      },
                      ticks: {
                        display: false,
                      },
                    },
                  },
                }}
              />
            }
          />
          <CCard className="mb-4 cursor-pointer" onClick={() => navigate('/Products/AllProducts')}>
            <CCardBody className="py-2 px-3">
              <div className="d-flex justify-content-between">
                <div>
                  <span className="text-medium-emphasis small">Total</span>
                  <div className="fw-semibold">{products}</div>
                </div>
               {localStorage.getItem('role')?.replace(/"/g, '') === 'ADMIN' && (
                <div>
                  <span className="text-medium-emphasis small">Out of Stock</span>
                  <div className="fw-semibold">{outofstock}</div>
                </div>
               )}
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        {localStorage.getItem('role')?.replace(/"/g, '') !== 'DEALER' && (
          <CCol sm={6} xl={4} xxl={3}>
            <CWidgetStatsA
              color="info"
              value={<>₹{income.totalAmount}</>}
              title="Income"
              chart={
                <CChartBar
                  className="mt-3 mx-3"
                  style={{ height: '70px' }}
                  data={{
                    labels: [
                      'January',
                      'February',
                      'March',
                      'April',
                      'May',
                      'June',
                      'July',
                      'August',
                      'September',
                      'October',
                      'November',
                      'December',
                    ],
                    datasets: [
                      {
                        label: 'My First dataset',
                        backgroundColor: 'rgba(255,255,255,.2)',
                        borderColor: 'rgba(255,255,255,.55)',
                        data: [78, 81, 80, 45, 34, 12, 40, 85, 65, 23, 12, 98, 34, 84, 67, 82],
                        barPercentage: 0.6,
                      },
                    ],
                  }}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    scales: {
                      x: {
                        grid: {
                          display: false,
                          drawTicks: false,
                        },
                        ticks: {
                          display: false,
                        },
                      },
                      y: {
                        border: {
                          display: false,
                        },
                        grid: {
                          display: false,
                          drawBorder: false,
                          drawTicks: false,
                        },
                        ticks: {
                          display: false,
                        },
                      },
                    },
                  }}
                />
              }
            />
            <CCard className="mb-4 ">
              <CCardBody className="py-2 px-3">
                <div className="d-flex justify-content-between">
                  <div>
                    <span className="text-medium-emphasis small">Total</span>
                    <div className="fw-semibold">₹{Number(income.totalAmount).toFixed(2)}</div>
                  </div>
                  <div>
                    <span className="text-medium-emphasis small">Pending</span>
                    <div className="fw-semibold">₹{Number(income.pendingAmount).toFixed(2)}</div>
                  </div>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        )}
        {localStorage.getItem('role')?.replace(/"/g, '') !== 'DEALER' && (
          <CCol sm={6} xl={4} xxl={3}>
            <CWidgetStatsA
              className="cursor-pointer"
              onClick={() => navigate('/DealersDistributors')}
              color="info"
              value={ localStorage.getItem('role')?.replace(/"/g, '') === 'DISTRIBUTER' ? <>{users.dealerCount}</> : <>{users.total}</>}
              title={localStorage.getItem('role')?.replace(/"/g, '') === 'DISTRIBUTER' ? "Dealers" : "Dealers / Distributors"}
              chart={
                <CChartBar
                  className="mt-3 mx-3"
                  style={{ height: '70px' }}
                  data={{
                    labels: [
                      'January',
                      'February',
                      'March',
                      'April',
                      'May',
                      'June',
                      'July',
                      'August',
                      'September',
                      'October',
                      'November',
                      'December',
                    ],
                    datasets: [
                      {
                        label: 'My First dataset',
                        backgroundColor: 'rgba(255,255,255,.2)',
                        borderColor: 'rgba(255,255,255,.55)',
                        data: [78, 81, 80, 45, 34, 12, 40, 85, 65, 23, 12, 98, 34, 84, 67, 82],
                        barPercentage: 0.6,
                      },
                    ],
                  }}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    scales: {
                      x: {
                        grid: {
                          display: false,
                          drawTicks: false,
                        },
                        ticks: {
                          display: false,
                        },
                      },
                      y: {
                        border: {
                          display: false,
                        },
                        grid: {
                          display: false,
                          drawBorder: false,
                          drawTicks: false,
                        },
                        ticks: {
                          display: false,
                        },
                      },
                    },
                  }}
                />
              }
            />
            <CCard className="mb-4">
              <CCardBody className="py-2 px-3">
                <div className="d-flex justify-content-between">
                  <div>
                    <span className="text-medium-emphasis small">Dealers</span>
                    <div className="fw-semibold">{users.dealerCount}</div>
                  </div>
                  {localStorage.getItem('role')?.replace(/"/g, '') !== 'DISTRIBUTER' && (
                    <div>
                      <span className="text-medium-emphasis small">Distributors</span>
                      <div className="fw-semibold">{users.distributorCount}</div>
                    </div>
                  )}
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        )}
        <CCol sm={6} xl={4} xxl={3}>
          <CWidgetStatsA
            color="info"
            className="cursor-pointer"
            onClick={() => navigate('/Orders')}
            value={<>{orders?.total}</>}
            title="Orders"
            chart={
              <CChartBar
                className="mt-3 mx-3"
                style={{ height: '70px' }}
                data={{
                  labels: [
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December',
                  ],
                  datasets: [
                    {
                      label: 'My First dataset',
                      backgroundColor: 'rgba(255,255,255,.2)',
                      borderColor: 'rgba(255,255,255,.55)',
                      data: [78, 81, 80, 45, 34, 12, 40, 85, 65, 23, 12, 98, 34, 84, 67, 82],
                      barPercentage: 0.6,
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    x: {
                      grid: {
                        display: false,
                        drawTicks: false,
                      },
                      ticks: {
                        display: false,
                      },
                    },
                    y: {
                      border: {
                        display: false,
                      },
                      grid: {
                        display: false,
                        drawBorder: false,
                        drawTicks: false,
                      },
                      ticks: {
                        display: false,
                      },
                    },
                  },
                }}
              />
            }
          />{' '}
          <CCard className="mb-4">
            <CCardBody className="py-2 px-3">
              <div className="d-flex justify-content-between mb-2">
                <div>
                  <span className="text-medium-emphasis small">Total</span>
                  <div className="fw-semibold">{orders?.total}</div>
                </div>
                <div>
                  <span className="text-medium-emphasis small">Pending</span>
                  <div className="fw-semibold">{orders?.pending}</div>
                </div>
                <div>
                  <span className="text-medium-emphasis small">Today</span>
                  <div className="fw-semibold">{orders?.today}</div>
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

WidgetsDropdown.propTypes = {
  className: PropTypes.string,
  withCharts: PropTypes.bool,
}

export default WidgetsDropdown
