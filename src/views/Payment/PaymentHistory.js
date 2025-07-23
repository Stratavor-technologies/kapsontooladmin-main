import React, { useEffect, useState } from 'react'
import {
  CContainer,
  CRow,
  CCol,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CButton,
  CTableDataCell,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import { getRequest } from '../../Services/apiMethods'

const PaymentHistory = () => {
  const navigate = useNavigate()
  const [paymentHistory, setPaymentHistory] = useState([])
  const [totalPaidAmount, setTotalPaidAmount] = useState(0)
  const userRole = localStorage.getItem('role')
  const [income, setIncome] = useState([])

  const fetchPendingPayments = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await getRequest('/payments?paymentStatus=done', token)
      // console.log('Pending Payments:', response)
      if (response.isSuccess && response.items) {
        const transformedPayments = response.items.map((payment) => ({
          date: new Date(payment.paymentDate).toLocaleDateString(),
          invoiceNo: payment.invoiceId?.invoiceId || '-',
          paidTo: payment.addressId?.partyDetails?.partyName || payment.userId?.fullName || payment.userId?.firmName || '-',
          instNo: payment.id || '-',
          instDate: new Date(payment.paymentDate).toLocaleDateString(),
          paymentMethod: payment.paymentMethod || '-',
          amount: payment.amount || 0,
        }))
        setPaymentHistory(transformedPayments)
        const totalAmount = transformedPayments.reduce((sum, payment) => sum + payment.amount, 0)
        setTotalPaidAmount(totalAmount)
      } else {
        setPaymentHistory([])
      }
    } catch (error) {
      console.error('Error fetching pending payments:', error)
      setPaymentHistory([])
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
  }, [])

  return (
    <CContainer fluid className="p-3">
      <CRow className="mb-3">
        <CCol>
        <h1 className="mb-2">Received Payment History</h1>
        </CCol>
      </CRow>

      <CRow className="mb-4">
        <CCol>
          <div className="fs-5">
            Received Amount: <span className="ms-2">{Number(income.totalAmount).toFixed(2)}</span>
          </div>
        </CCol>
      </CRow>

      <CTable responsive bordered className="border-secondary">
        <CTableHead>
          <CTableRow className="bg-dark">
            <CTableHeaderCell className="border-secondary">Date</CTableHeaderCell>
            <CTableHeaderCell className="border-secondary"> Inv. No.</CTableHeaderCell>
            <CTableHeaderCell className="border-secondary">Paid By</CTableHeaderCell>
            <CTableHeaderCell className="border-secondary">Inst. No.</CTableHeaderCell>
            <CTableHeaderCell className="border-secondary">Inst. Date</CTableHeaderCell>
            <CTableHeaderCell className="border-secondary">Payment Method</CTableHeaderCell>
            <CTableHeaderCell className="border-secondary">Amount</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {paymentHistory.length > 0 ? (
            paymentHistory.map((payment, index) => (
              <CTableRow key={index} className="bg-dark">
                <CTableDataCell className="border-secondary">{payment.date}</CTableDataCell>
                <CTableDataCell className="border-secondary">{payment.invoiceNo}</CTableDataCell>
                <CTableDataCell className="border-secondary">{payment.paidTo}</CTableDataCell>
                <CTableDataCell className="border-secondary">{payment.instNo}</CTableDataCell>
                <CTableDataCell className="border-secondary">{payment.instDate}</CTableDataCell>
                <CTableDataCell className="border-secondary">
                  {payment.paymentMethod}
                </CTableDataCell>
                <CTableDataCell className="border-secondary">
                  {payment.amount.toFixed(2)}
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow className="bg-dark">
              <CTableDataCell colSpan={7} className="border-secondary text-center">
                No payments found
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>
    </CContainer>
  )
}

export default PaymentHistory
