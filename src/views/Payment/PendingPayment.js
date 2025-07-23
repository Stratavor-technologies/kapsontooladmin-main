import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CContainer,
  CRow,
  CCol,
  CBreadcrumb,
  CBreadcrumbItem,
  CFormInput,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import { getRequest } from '../../Services/apiMethods'

const PendingPayments = () => {
  const navigate = useNavigate()
  const [customer, setCustomer] = useState('All Customers')
  const [pendingPayments, setPendingPayments] = useState([])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [filteredPayments, setFilteredPayments] = useState([])
  const [income, setIncome] = useState([])

  const fetchPendingPayments = async () => {
    try {
      const token = localStorage.getItem('token')
      const userId = localStorage.getItem('id')
      // console.log('userId', userId)
      const cleanUserId = userId.replace(/['"]/g, '')
      const response = await getRequest('/payments?paymentStatus=pending', token)
      console.log('Pending Payments:', response)
      if (response.isSuccess && response.items) {
        // Transform the API response to match your fields
        const transformedPayments = response.items.map(payment => ({
          id: payment.id,
          invoiceDate: new Date(payment.paymentDate).toLocaleDateString(),
          invoiceNo: payment.invoiceId?.invoiceId || '-',
          partyName: payment.addressId?.partyDetails?.partyName || payment.userId?.fullName || payment.userId?.firmName || '-',
          pendingAmount: payment.amount || 0,
          dueDate: new Date(payment.dueDate).toLocaleDateString()
        }))
        setPendingPayments(transformedPayments)
      } else {
        setPendingPayments([])
      }
    } catch (error) {
      console.error('Error fetching pending payments:', error)
      setPendingPayments([])
    }
  }
  const getIncome = async () => {
    const token = localStorage.getItem('token') // Adjust based on your auth logic
    const response = await getRequest('/dashboards/income-detail', token)
    // console.log('Response', response)
    setIncome(response.data)
    // setOutofstock(response.data.count)
  }

  useEffect(() => {
    fetchPendingPayments()
    getIncome()
    // console.log("first")
  }, [])

  const totalAmount = (pendingPayments || []).reduce((total, payment) => {
    return total + (payment.pendingAmount || 0)
  }, 0)

  const handleDownloadReport = () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates')
      return
    }

    const filteredData = pendingPayments.filter(payment => {
      // Convert dates to comparable format
      const paymentDate = new Date(payment.invoiceDate.split('/').reverse().join('-'))
      const start = new Date(startDate)
      const end = new Date(endDate)
      end.setHours(23, 59, 59, 999) // Include the entire end date
      return paymentDate >= start && paymentDate <= end
    })

    if (filteredData.length === 0) {
      alert('No data found for the selected date range')
      return
    }

    // Create CSV content with proper formatting
    const headers = ['Invoice Date', 'Invoice No.', 'Party Name', 'Pending Amount', 'Due Date']
    const csvContent = [
      headers.join(','),
      ...filteredData.map(payment => {
        // Format the data properly for CSV
        const row = [
          `"${payment.invoiceDate}"`,
          `"${payment.invoiceNo}"`,
          `"${payment.partyName}"`,
          payment.pendingAmount.toFixed(2),
          `"${payment.dueDate}"`
        ]
        return row.join(',')
      })
    ].join('\n')

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `pending_payments_${startDate}_to_${endDate}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <CContainer fluid className=" p-3">
      <CRow className="mb-3">
        <CCol>
          <h1 className="mb-2">Pending Payments</h1>
        </CCol>
        <CCol xs="auto">
          <div className="d-flex gap-2">
          <div> from </div>
            <CFormInput
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Start Date"
              style={{ width: '150px' }}
            />
            <div> to </div>
            <CFormInput
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="End Date"
              style={{ width: '150px' }}
            />
            <CButton color="primary" onClick={handleDownloadReport}>
              Download Report
            </CButton>
          </div>
        </CCol>
      </CRow>

      <CRow className="mb-4">
        <CCol>
          <div className=" fs-5">
            Total Amount To Receive : <span className="ms-2">{income.pendingAmount}</span>
          </div>
        </CCol>
      </CRow>

      {/* <CCard className="mb-4">
        <CCardBody className="p-0">
          <CDropdown className="w-100">
            <CDropdownToggle
              className="w-100 text-start  d-flex justify-content-between align-items-center"
              caret
            >
              {customer}
            </CDropdownToggle>
            <CDropdownMenu className="w-100">
              <CDropdownItem onClick={() => setCustomer('All Customers')}>
                All Customers
              </CDropdownItem>
              <CDropdownItem onClick={() => setCustomer('SHAILESH TTCR')}>
                SHAILESH TTCR
              </CDropdownItem>
              <CDropdownItem onClick={() => setCustomer('TTCR')}>TTCR</CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
        </CCardBody>
      </CCard> */}

      <CTable responsive bordered className="border-secondary">
        <CTableHead>
          <CTableRow className="">
            <CTableHeaderCell className=" border-secondary">Invoice Date</CTableHeaderCell>
            <CTableHeaderCell className="border-secondary">Invoice No.</CTableHeaderCell>
            <CTableHeaderCell className=" border-secondary">Party Name</CTableHeaderCell>
            <CTableHeaderCell className=" border-secondary">Pending Amount</CTableHeaderCell>
            <CTableHeaderCell className=" border-secondary">Due Date</CTableHeaderCell>
            <CTableHeaderCell className=" border-secondary">Action</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {pendingPayments.map((payment, index) => (
            <CTableRow key={index} className="">
              <CTableDataCell className="border-secondary">{payment.invoiceDate || '-'}</CTableDataCell>
              <CTableDataCell className="border-secondary">{payment.invoiceNo || '-'}</CTableDataCell>
              <CTableDataCell className="border-secondary">{payment.partyName || '-'}</CTableDataCell>
              <CTableDataCell className="border-secondary">
                {(payment.pendingAmount || 0).toFixed(2)}
              </CTableDataCell>
              <CTableDataCell className="border-secondary">{payment.dueDate || '-'}</CTableDataCell>
              <CTableDataCell className="border-secondary">
                <CButton
                  color="primary"
                  size="sm"
                  className=""
                  onClick={() => {
                    navigate(`/Payments/ReceivePayment/${payment?.id}`)
                  }}
                >
                  Receive Payment
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </CContainer>
  )
}

export default PendingPayments
