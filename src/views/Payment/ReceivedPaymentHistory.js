import React, { useState, useEffect } from 'react'
import {
  CContainer,
  CRow,
  CCol,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CBreadcrumb,
  CBreadcrumbItem,
  CButton,
} from '@coreui/react'
import { useNavigate, useParams } from 'react-router-dom'
import CloseIcon from '@mui/icons-material/Close'
import { getRequest } from '../../Services/apiMethods'

const ReceivedPaymentHistory = () => {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const [orderDetails, setOrderDetails] = useState(null);
  const [income, setIncome] = useState([])
  const navigate = useNavigate()
  const getOrderDetails = async () => {
    const cleanRole = role?.replace(/"/g, '')
    const response = await getRequest('payments?type=1', token)
    if (response?.data) {
      setOrderDetails(response.data)
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
    getOrderDetails()
    getIncome()
  }, [])
  // Sample data for payment history
  // const paymentHistory = [
  //   {
  //     date: '29-11-2024',
  //     invoiceNo: 'INV-1234',
  //     from: 'TTCR',
  //     instNo: 'AVVV',
  //     instDate: '2024-11-29',
  //     paymentMethod: 'CASH',
  //     amount: 48000.44,
  //   },
  //   {
  //     date: '29-11-2024',
  //     invoiceNo: 'INV-1234',
  //     from: 'TTCR',
  //     instNo: 'GCGC',
  //     instDate: '2024-11-29',
  //     paymentMethod: 'CASH',
  //     amount: 28133.0,
  //   },
  //   {
  //     date: '03-12-2024',
  //     invoiceNo: '123456RT',
  //     from: 'SHAILESH TTCR',
  //     instNo: 'TTC1',
  //     instDate: '2024-12-03',
  //     paymentMethod: 'CASH',
  //     amount: 14999.53,
  //   },
  //   {
  //     date: '17-01-2025',
  //     invoiceNo: '123456RT',
  //     from: 'SHAILESH TTCR',
  //     instNo: 'HDFC3312',
  //     instDate: '2025-01-17',
  //     paymentMethod: 'NET BANKING',
  //     amount: 15729.0,
  //   },
  //   {
  //     date: '17-01-2025',
  //     invoiceNo: 'INV123456',
  //     from: 'TTCR',
  //     instNo: 'ICICI',
  //     instDate: '2025-01-17',
  //     paymentMethod: 'NETBANKIN',
  //     amount: 31634.01,
  //   },
  //   {
  //     date: '17-01-2025',
  //     invoiceNo: 'TTC4567',
  //     from: 'SHAILESH TTCR',
  //     instNo: 'SBI1528',
  //     instDate: '2025-01-17',
  //     paymentMethod: 'SBI NETBANING',
  //     amount: 15337.67,
  //   },
  //   {
  //     date: '21-01-2025',
  //     invoiceNo: 'KAP101',
  //     from: 'SHAILESH TTCR',
  //     instNo: 'SCI',
  //     instDate: '2025-01-23',
  //     paymentMethod: 'NET BANKING',
  //     amount: 5975.2,
  //   },
  //   {
  //     date: '23-01-2025',
  //     invoiceNo: '5555666666',
  //     from: 'TTCR',
  //     instNo: '123456',
  //     instDate: '2025-01-23',
  //     paymentMethod: 'RTGS',
  //     amount: 29948.78,
  //   },
  // ]

  // Calculate total amount
  const totalAmount = paymentHistory.reduce((total, payment) => total + payment.amount, 0)

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const [year, month, day] = dateString.split('-')
    return `${day}-${month}-${year}`
  }

  return (
    <CContainer fluid className="p-3">
      <CRow className="mb-3">
        <CCol className="d-flex justify-content-between">

          <h1 className="mb-2">Paid Amount History</h1>
          {role !== "DEALER" && (
            <CButton
              onClick={() => {
                navigate(-1);
              }}
            >
              <CloseIcon />
            </CButton>
          )}
        </CCol>
      </CRow>

      <CRow className="mb-4">
        <CCol>
          <div className=" fs-5">
            Total Received Amount : <span className="ms-2">{income.totalAmount}</span>
          </div>
        </CCol>
      </CRow>

      {/* <CRow className="mb-4">
        <CCol>
          <CDropdown className="w-100">
            <CDropdownToggle
              className="w-100  text-start  border d-flex justify-content-between align-items-center border-bottom border-secondary rounded-0"
              caret
            >
              customer
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
        </CCol>
      </CRow> */}

      <CTable responsive bordered className="border-secondary">
        <CTableHead>
          <CTableRow className="">
            <CTableHeaderCell className=" border-secondary">Date</CTableHeaderCell>
            <CTableHeaderCell className=" border-secondary">Against Inv. No.</CTableHeaderCell>
            <CTableHeaderCell className=" border-secondary">From</CTableHeaderCell>
            <CTableHeaderCell className=" border-secondary">Inst. No.</CTableHeaderCell>
            <CTableHeaderCell className="border-secondary">Inst. Date</CTableHeaderCell>
            <CTableHeaderCell className=" border-secondary">Payment Method</CTableHeaderCell>
            <CTableHeaderCell className=" border-secondary">Amount</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {paymentHistory.map((payment, index) => (
            <CTableRow key={index} className="bg-dark">
              <CTableDataCell className="border-secondary">{payment.date}</CTableDataCell>
              <CTableDataCell className="border-secondary">{payment.invoiceNo}</CTableDataCell>
              <CTableDataCell className="border-secondary">{payment.from}</CTableDataCell>
              <CTableDataCell className="border-secondary">{payment.instNo}</CTableDataCell>
              <CTableDataCell className="border-secondary">
                {formatDate(payment.instDate)}
              </CTableDataCell>
              <CTableDataCell className="border-secondary">{payment.paymentMethod}</CTableDataCell>
              <CTableDataCell className="border-secondary">
                {payment.amount.toFixed(2)}
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </CContainer>
  )
}

export default ReceivedPaymentHistory
