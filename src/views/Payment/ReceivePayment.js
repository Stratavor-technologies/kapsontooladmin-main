import React, { useState, useEffect } from 'react'
import {
  CContainer,
  CRow,
  CCol,
  CForm,
  CFormInput,
  CFormSelect,
  CButton,
  CBreadcrumb,
  CBreadcrumbItem,
} from '@coreui/react'
import { useParams, useNavigate } from 'react-router-dom'
import { getRequest, postRequest, putRequest } from '../../Services/apiMethods'
// import { toast } from 'react-toastify'
const ReceivePayment = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  // State for form fields
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: '',
    partyName: '',
    // instrumentNo: '',
    // instrumentDate: '',
    paymentMethod: '',
    amount: '',
    paymentStatus: 'done',
  })
  const fetchPaymentHistory = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await getRequest(`/payments/${id}`, token)
      console.log('response', response)
      
      if (response.isSuccess && response.data) {
        const data = response.data
        setInvoiceData({
          invoiceNumber: data.invoiceId?.invoiceId || '',
          partyName: data.addressId?.partyDetails?.partyName || data.userId?.fullName || data.userId?.firmName || '',
          // instrumentNo: '',
          // instrumentDate: '',
          paymentMethod: '',
          amount: data.amount || 0
        })
      }
    } catch (error) {
      console.error('Error fetching payment details:', error)
    }
  }
  useEffect(() => {
    fetchPaymentHistory()
  }, [])
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setInvoiceData({
      ...invoiceData,
      [name]: value,
    })
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    // console.log('Payment received:', invoiceData)
    if (invoiceData.paymentMethod === '') {
        setError('Please select a payment method')
      return
    }
    invoiceData.paymentStatus = 'done'
    // console.log('invoiceData', invoiceData)
    const token = localStorage.getItem('token')
    const response = await putRequest(`/payments/${id}`,  invoiceData ,token)
    console.log('response', response)
    if (response.isSuccess) {
      navigate('/Payments/PaymentHistory')
    }
    else {
      console.log('response', response)
    }
    // Add API call or other logic here
  }

  // Payment method options
  const paymentMethods = [
    { value: '', label: 'Select payment method' },
    { value: 'cash', label: 'Cash' },
    { value: 'cheque', label: 'Cheque' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'upi', label: 'UPI' },
  ]

  return (
    <CContainer fluid className="p-3">
      <CRow className="mb-3">
        <CCol>
          <h1 className="mb-2">Receive Payment</h1>
        </CCol>
      </CRow>

      <CForm onSubmit={handleSubmit}>
        <CRow className="mb-4">
          <CCol md={6}>
            <div className="mb-4">
              <label className=" mb-2 d-block">Invoive Number</label>
              <CFormInput
                type="text"
                name="instrumentNo"
                value={invoiceData.invoiceNumber}
                onChange={handleChange}
                disabled
                // className=" border border p-0"
                placeholder="Enter instrument number"
              />
            </div>

            {/* <div className="mb-4">
              <label className=" mb-2 d-block">Instrument No.</label>
              <CFormInput
                type="text"
                name="instrumentNo"
                value={invoiceData.instrumentNo}
                onChange={handleChange}
                // className=" border border p-0"
                placeholder="Enter instrument number"
              />
            </div> */}

            <div className="mb-4">
              <label className=" mb-2 d-block">Payment Method</label>
              <CFormSelect
                name="paymentMethod"
                value={invoiceData.paymentMethod}
                onChange={handleChange}
                // className="bg-dark text-white border-0 border-bottom border-secondary p-0"
                options={paymentMethods}
              />
            </div>
          </CCol>

          <CCol md={6}>
            <div className="mb-4">
              <label className=" mb-2 d-block">Party Name</label>
              <CFormInput
                type="text"
                name="instrumentDate"
                disabled
                value={invoiceData.partyName}
                onChange={handleChange}
                // className="bg-dark text-white border-0 border-bottom border-secondary p-0"
              />
            </div>

            {/* <div className="mb-4">
              <label className=" mb-2 d-block">Instrument Date</label>
              <CFormInput
                type="date"
                name="instrumentDate"
                value={invoiceData.instrumentDate}
                onChange={handleChange}
                // className="bg-dark text-white border-0 border-bottom border-secondary p-0"
              />
            </div> */}

            <div className="mb-4">
              <label className=" mb-2 d-block">Amount</label>
              <CFormInput
                type="text"
                name="instrumentDate"
                value={invoiceData.amount}
                onChange={handleChange}
                // className="bg-dark text-white border-0 border-bottom border-secondary p-0"
              />
            </div>
          </CCol>
        </CRow>
        {error && <div className="text-danger">{error}</div>}

        <CRow>
          <CCol className="d-flex justify-content-end">
            <CButton
              type="submit"
              color="primary"
              className="px-4 "
              // style={{ backgroundColor: '#fd7e14', borderColor: '#fd7e14' }}
            >
              Submit
            </CButton>
          </CCol>
        </CRow>
      </CForm>
    </CContainer>
  )
}

export default ReceivePayment
