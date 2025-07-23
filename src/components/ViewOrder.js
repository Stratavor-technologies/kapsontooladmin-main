import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CFormSelect,
  CFormInput,
  CSpinner,
} from '@coreui/react'
import CloseIcon from '@mui/icons-material/Close'
import { useNavigate, useParams } from 'react-router-dom'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { getRequest } from '../Services/apiMethods'
// Dummy data for initial rendering
const dummyData = {
  partyDetails: {
    name: 'TTC Group',
    contactNo: '888778888',
    email: 'admin@theimes.co.h',
    address: 'mailmail.cs.saissa/helps.info',
    gstNo: '00170202420',
  },
  orderDetails: {
    orderNo: '32',
    orderDate: '24-02-2025',
    orderAmount: '27785.95',
    orderStatus: 'Active',
    orderDisposal: '30%',
  },
  products: [
    {
      srNo: 1,
      artNo: 'K-02115X',
      productName: 'OL CAN',
      hsn: '$431910',
      mrp: 10.6,
      basicPrice: 8.76,
      quantity: 72,
      gstAmt: 254.54,
      total: 688.2,
    },
    {
      srNo: 2,
      artNo: 'K-02114-PH21OL.CAN15X',
      productName: 'OL CAN',
      hsn: '$431910',
      mrp: 87.0,
      basicPrice: 74.45,
      quantity: 100,
      gstAmt: 445.67,
      total: 8346,
    },
    {
      srNo: 3,
      artNo: 'K-03415X',
      productName: 'OL CAN',
      hsn: '$431910',
      mrp: 18.6,
      basicPrice: 10.52,
      quantity: 72,
      gstAmt: 342.88,
      total: 727.5,
    },
  ],
  orderRemarks: 'Urgency Request Before',
}


const ViewOrder = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [status, setStatus] = useState('')
  const [remarks, setRemarks] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [orderData, setOrderData] = useState(dummyData)

  // Simulate API call to fetch actual data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real application, you would make your API call here
        // For example: const response = await fetch('/api/orders/32');
        // const data = await response.json();

        // Simulating API delay with setTimeout
        setTimeout(() => {
          // For demonstration, we're using the same data
          // In a real app, you would replace this with actual API data
          // setOrderData(data);
          setLoading(false)
        }, 100) // Simulate 2 second loading time
      } catch (error) {
        console.error('Error fetching order data:', error)
        setLoading(false)
        // You might want to set an error state here
      }
    }

    fetchData()
  }, [])
  const getOrder = async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await getRequest(`/orders/${id}`, token)
      console.log('Order response:', response.data)
      if (response.isSuccess && response.data) {
        const orderData = {
          partyDetails: response.data.addressId.partyDetails,
          orderDetails: {
            orderNo: response.data.id,
            orderDate: new Date(response.data.createdAt).toLocaleDateString(),
            orderAmount: response.data.items.reduce((sum, item) => sum + Number(item.totalPrice), 0),
            orderStatus: response.data.status,
            // orderDisposal: '30%'
          },
          products: response.data.items.map((item, index) => {
            const totalPrice = Number(item.totalPrice)
            const gstAmount = totalPrice * 0.18 // Calculate GST as 18% of total price
            return {
              srNo: index + 1,
              artNo: item.productId.ArtNumber,
              productName: item.productId.productName,
              hsn: item.productId.hsnNumber,
              mrp: Number(item.productId.mrp),
              basicPrice: Number(item.productId.basicPrice),
              quantity: Number(item.quantity),
              gstAmt: gstAmount,
              total: totalPrice
            }
          }),
          orderRemarks: 'Urgency Request Before'
        }
        setOrderData(orderData)
      }
    } catch (error) {
      console.error('Error fetching order data:', error)
    }
  }
  const handleSave = () => {
    if (!status) {
      setError('Please select a status before saving.')
      return
    }
    setError('') // Clear error if status is selected
    console.log('Status:', status)
    console.log('Remarks:', remarks)
    navigate(-1)
    // Add logic to save data here
  }
  useEffect(() => {
    getOrder()
  }, [id])

  const handleDownloadPDF = () => {
    const doc = new jsPDF()

    // Set font size and style
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('Order Details', 105, 15, { align: 'center' })

    // Reset font for normal text
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')

    // Party Details
    doc.setFont('helvetica', 'bold')
    doc.text('Party Details:', 14, 30)
    doc.setFont('helvetica', 'normal')
    doc.text(`Party Name: ${orderData.partyDetails.partyName}`, 14, 40)
    doc.text(`Contact No.: ${orderData.partyDetails.contactNo}`, 14, 45)
    doc.text(`E-mail: ${orderData.partyDetails.email}`, 14, 50)
    doc.text(`Address: ${orderData.partyDetails.address}`, 14, 55)
    doc.text(`GST No.: ${orderData.partyDetails.gstNo}`, 14, 60)

    // Order Details
    doc.setFont('helvetica', 'bold')
    doc.text('Order Details:', 120, 30)
    doc.setFont('helvetica', 'normal')
    doc.text(`Order No.: ${orderData.orderDetails.orderNo}`, 120, 40)
    doc.text(`Order Date: ${orderData.orderDetails.orderDate}`, 120, 45)
    doc.text(`Order Amount: ${orderData.orderDetails.orderAmount}`, 120, 50)
    doc.text(`Order Status: ${orderData.orderDetails.orderStatus}`, 120, 55)
    // doc.text(`Order Disposal: ${orderData.orderDetails.orderDisposal}`, 120, 60)

    // Products Table
    doc.setFont('helvetica', 'bold')
    doc.text('Orders Products:', 14, 75)

    // Create table for products using autoTable plugin
    autoTable(doc, {
      startY: 80,
      head: [
        [
          'Sr. No.',
          'Art No.',
          'Product Name',
          'HSN',
          'M.R.P',
          'Basic Price',
          'Qty (Pcs.)',
          'GST Amt',
          'Total',
        ],
      ],
      body: orderData.products.map((product) => [
        product.srNo,
        product.artNo,
        product.productName,
        product.hsn,
        product.mrp,
        product.basicPrice,
        product.quantity,
        product.gstAmt,
        product.total,
      ]),
      theme: 'striped',
      headStyles: { fillColor: [66, 139, 202] },
    })

    // Calculate total
    const grandTotal = orderData.products.reduce((sum, product) => sum + product.total, 0)

    const finalY = doc.lastAutoTable.finalY + 10

    // Order Remarks
    doc.setFont('helvetica', 'bold')
    doc.text('Order Remarks:', 14, finalY)
    doc.setFont('helvetica', 'normal')
    doc.text(orderData.orderRemarks, 14, finalY + 5)

    // Total Amount
    doc.setFont('helvetica', 'bold')
    doc.text(`Grand Total: ${grandTotal.toFixed(2)}`, 170, finalY + 15, { align: 'right' })

    // Save the PDF
    doc.save(`Order_${orderData.orderDetails.orderNo}.pdf`)
  }

  // Show loading spinner while data is being fetched
  if (loading) {
    return (
      <CCard>
        <CCardHeader>
          <CloseIcon style={{ cursor: 'pointer' }} onClick={() => navigate(-1)} />
        </CCardHeader>
        <CCardBody
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: '300px' }}
        >
          <div className="text-center">
            <CSpinner color="primary" />
            <div className="mt-2">Loading order details...</div>
          </div>
        </CCardBody>
      </CCard>
    )
  }

  return (
    <CCard>
      <CCardHeader
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <CloseIcon style={{ cursor: 'pointer' }} onClick={() => navigate(-1)} />
        <CButton color="primary" onClick={handleDownloadPDF}>
          Download
        </CButton>
      </CCardHeader>
      <CCardBody>
        <CRow>
          <CCol style={{ display: 'flex' }}>
            <CTable striped bordered>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell colSpan="2">Party Details</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow>
                  <CTableDataCell>Party Name</CTableDataCell>
                  <CTableDataCell>{orderData.partyDetails.partyName}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableDataCell>Contact No.</CTableDataCell>
                  <CTableDataCell>{orderData.partyDetails.contactNo}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableDataCell>E-mail</CTableDataCell>
                  <CTableDataCell>{orderData.partyDetails.email}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableDataCell>Address</CTableDataCell>
                  <CTableDataCell>{orderData.partyDetails.address}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableDataCell>Gst No.</CTableDataCell>
                  <CTableDataCell>{orderData.partyDetails.gstNo}</CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
            <CTable striped bordered>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell colSpan="2">Order Details</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow>
                  <CTableDataCell>Order No.</CTableDataCell>
                  <CTableDataCell>{orderData.orderDetails.orderNo}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableDataCell>Order Date</CTableDataCell>
                  <CTableDataCell>{orderData.orderDetails.orderDate}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableDataCell>Order Amount</CTableDataCell>
                  <CTableDataCell>{orderData.orderDetails.orderAmount}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableDataCell>Order Status</CTableDataCell>
                  <CTableDataCell>{orderData.orderDetails.orderStatus}</CTableDataCell>
                </CTableRow>
                {/* <CTableRow>
                  <CTableDataCell>Order Disposal</CTableDataCell>
                  <CTableDataCell>{orderData.orderDetails.orderDisposal}</CTableDataCell>
                </CTableRow> */}
              </CTableBody>
            </CTable>
          </CCol>
        </CRow>

        <CRow className="mt-4">
          <CCol>
            <h2>Orders Products</h2>
            <CTable striped bordered>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Sr. No.</CTableHeaderCell>
                  <CTableHeaderCell>Art No.</CTableHeaderCell>
                  <CTableHeaderCell>Product Name</CTableHeaderCell>
                  <CTableHeaderCell>HSN</CTableHeaderCell>
                  <CTableHeaderCell>M.R.P</CTableHeaderCell>
                  <CTableHeaderCell> Basic Price</CTableHeaderCell>
                  <CTableHeaderCell>Qty (Pcs.)</CTableHeaderCell>
                  <CTableHeaderCell>Gst Amt</CTableHeaderCell>
                  <CTableHeaderCell>Total </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {orderData.products.map((product) => (
                  <CTableRow key={product.srNo}>
                    <CTableDataCell>{product.srNo}</CTableDataCell>
                    <CTableDataCell>{product.artNo}</CTableDataCell>
                    <CTableDataCell>{product.productName}</CTableDataCell>
                    <CTableDataCell>{product.hsn}</CTableDataCell>
                    <CTableDataCell>{product.mrp.toFixed(2)}</CTableDataCell>
                    <CTableDataCell>{product.basicPrice.toFixed(2)}</CTableDataCell>
                    <CTableDataCell>{product.quantity}</CTableDataCell>
                    <CTableDataCell>{product.gstAmt.toFixed(2)}</CTableDataCell>
                    <CTableDataCell>{product.total.toFixed(2)}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCol>
        </CRow>

        <CRow className="mt-4">
          <CCol>
            <h2>Order Remarks</h2>
            <CTable striped bordered>
              <CTableBody>
                <CTableRow>
                  <CTableDataCell>{orderData.orderRemarks}</CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
          </CCol>
        </CRow>

        <CRow className="mt-4">
          <CCol>
            <h2>Admin Remarks</h2>
            <CTable striped bordered>
              <CTableBody>
                <CTableRow>
                  <CTableDataCell> Date</CTableDataCell>
                  <CTableDataCell>Remark Type</CTableDataCell>
                  <CTableDataCell>Remark</CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
          </CCol>
        </CRow>

        <CRow className="mt-4">
          <CCol>
            <h2>Change Order Status</h2>
            <CTable striped bordered>
              <CTableBody>
                <CTableRow>
                  <CTableDataCell>
                    <label htmlFor="status">Select Status</label>
                    <CFormSelect
                      id="status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="">-- Select Status --</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </CFormSelect>
                  </CTableDataCell>

                  <CTableDataCell>
                    <label htmlFor="remarks">Remarks</label>
                    <CFormInput
                      id="remarks"
                      placeholder="Enter remarks"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                    />
                  </CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
          </CCol>
        </CRow>

        <CRow className="mt-4">
          <CCol style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <CButton color="primary" onClick={handleSave}>
              Save Changes
            </CButton>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
  )
}

export default ViewOrder
