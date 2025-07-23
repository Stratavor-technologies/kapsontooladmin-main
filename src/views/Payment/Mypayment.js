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

const MyPayment = () => {
  const navigate = useNavigate()
  const [paymentHistory, setPaymentHistory] = useState([])
  const [totalPaidAmount, setTotalPaidAmount] = useState(0)
  const userRole = localStorage.getItem('role')

  const fetchPendingPayments = async () => {
    try {
      const token = localStorage.getItem('token')
      const role = localStorage.getItem('role')
      const cleanRole = role?.replace(/"/g, '')
      const response = await getRequest(`/payments?paymentStatus=done&role=${cleanRole}&type=1`, token)
      // console.log('Pending Payments:', response)
      if (response.isSuccess && response.items) {
        const transformedPayments = response.items.map((payment) => ({
          date: new Date(payment.paymentDate).toLocaleDateString(),
          invoiceNo: payment.invoiceId?.invoiceId || '-',
          paidTo: payment.addressId?.partyDetails?.partyName || payment.userId?.fullName || payment.userId?.firmName || '-',
          instNo: payment.id || '-',
          status: payment.paymentStatus || '-',
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

  useEffect(() => {
    fetchPendingPayments()
  }, [])

  return (
    <CContainer fluid className="p-3">
      <CRow className="mb-3">
        <CCol>
        <h1 className="mb-2">Own Payment Status</h1>
        </CCol>
      </CRow>

      <CRow className="mb-4">
        <CCol>
          <div className="fs-5">
            Paid Amount: <span className="ms-2">{totalPaidAmount.toFixed(2)}</span>
          </div>
        </CCol>
      </CRow>

      <CTable responsive bordered className="border-secondary">
        <CTableHead>
          <CTableRow className="bg-dark">
            <CTableHeaderCell className="border-secondary">Date</CTableHeaderCell>
            <CTableHeaderCell className="border-secondary"> Inv. No.</CTableHeaderCell>
            {/* <CTableHeaderCell className="border-secondary">Paid By</CTableHeaderCell> */}
            <CTableHeaderCell className="border-secondary">Status</CTableHeaderCell>
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
                {/* <CTableDataCell className="border-secondary">{payment.paidTo}</CTableDataCell> */}
                <CTableDataCell className="border-secondary text-center text-success fw-bold">{payment.status}</CTableDataCell>
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

export default MyPayment
