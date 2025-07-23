import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CForm,
  CFormSelect,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter } from '@coreui/react'
import DataTable from 'src/components/DataTable'
import VisibilityIcon from '@mui/icons-material/Visibility'
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline'
import DeleteIcon from '@mui/icons-material/Delete'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import { useNavigate, useParams } from 'react-router-dom'
import { getRequest } from '../Services/apiMethods'

const ViewOtherOrders = ({ orderData }) => {
  const [orderDetails, setOrderDetails] = useState(null)
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await getRequest(`/orders/${id}`, token)
        if (response?.data) {
          setOrderDetails(response.data)
        }
      } catch (error) {
        console.error('Error fetching order details:', error)
      }
    }

    if (id) {
      fetchOrderDetails()
    }
  }, [id])

  if (!orderDetails) {
    return (
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardBody>
              <div className="text-center py-4">
                <p>Loading order details...</p>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    )
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <strong>Order Details</strong>
              <CButton color="primary" onClick={() => navigate(-1)}>
                Back
              </CButton>
            </div>
          </CCardHeader>
          <CCardBody>
            {/* Order Information */}
            <div className="mb-4">
              <h5>Order Information</h5>
              <CTable>
                <CTableBody>
                  <CTableRow>
                    <CTableHeaderCell>Order Number</CTableHeaderCell>
                    <CTableDataCell>{orderDetails.orderNumber}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableDataCell>{orderDetails.status}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Total Amount</CTableHeaderCell>
                    <CTableDataCell>₹{orderDetails.totalAmount}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Order Date</CTableHeaderCell>
                    <CTableDataCell>{new Date(orderDetails.createdAt).toLocaleDateString()}</CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            </div>

            {/* Customer Information */}
            <div className="mb-4">
              <h5>Customer Information</h5>
              <CTable>
                <CTableBody>
                  <CTableRow>
                    <CTableHeaderCell>Firm Name</CTableHeaderCell>
                    <CTableDataCell>{orderDetails.userId?.firmName || 'N/A'}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Contact Person</CTableHeaderCell>
                    <CTableDataCell>{orderDetails.userId?.contactPerson || 'N/A'}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Contact Number</CTableHeaderCell>
                    <CTableDataCell>{orderDetails.userId?.phone || 'N/A'}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Email</CTableHeaderCell>
                    <CTableDataCell>{orderDetails.userId?.email || 'N/A'}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>GST Number</CTableHeaderCell>
                    <CTableDataCell>{orderDetails.userId?.gstNumber || 'N/A'}</CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            </div>

            {/* Delivery Address */}
            <div className="mb-4">
              <h5>Delivery Address</h5>
              <CTable>
                <CTableBody>
                  <CTableRow>
                    <CTableHeaderCell>Address</CTableHeaderCell>
                    <CTableDataCell>{orderDetails.addressId?.partyDetails?.address || 'N/A'}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>City</CTableHeaderCell>
                    <CTableDataCell>{orderDetails.addressId?.city || 'N/A'}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>State</CTableHeaderCell>
                    <CTableDataCell>{orderDetails.addressId?.state || 'N/A'}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Country</CTableHeaderCell>
                    <CTableDataCell>{orderDetails.addressId?.country || 'N/A'}</CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            </div>

            {/* Order Items */}
            <div className="mb-4">
              <h5>Order Items</h5>
              <CTable>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Product Name</CTableHeaderCell>
                    <CTableHeaderCell>Art Number</CTableHeaderCell>
                    <CTableHeaderCell>Quantity</CTableHeaderCell>
                    <CTableHeaderCell>Price</CTableHeaderCell>
                    <CTableHeaderCell>Total Price</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {orderDetails.items?.map((item, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>{item.productId?.productName || 'N/A'}</CTableDataCell>
                      <CTableDataCell>{item.productId?.ArtNumber || 'N/A'}</CTableDataCell>
                      <CTableDataCell>{item.quantity || 'N/A'}</CTableDataCell>
                      <CTableDataCell>₹{item.productId?.basicPrice || 'N/A'}</CTableDataCell>
                      <CTableDataCell>₹{item.totalPrice || 'N/A'}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default ViewOtherOrders