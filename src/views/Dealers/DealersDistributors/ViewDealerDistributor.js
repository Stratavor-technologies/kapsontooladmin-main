import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHeaderCell,
  CTableRow,
  CSpinner,
  CTabs,
  CTabContent,
  CTabPane,
  CNav,
  CNavItem,
  CNavLink,
  CToast,
  CToastBody,
  CToastHeader,
  CToaster,
} from '@coreui/react'
import { useNavigate, useParams } from 'react-router-dom'
import CloseIcon from '@mui/icons-material/Close'
import { getRequest } from '../../../Services/apiMethods'

const ViewDealerDistributor = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [dealer, setDealer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(1)
  const [toast, setToast] = useState(0)
  const [toastMessage, setToastMessage] = useState('')
  const [toastColor, setToastColor] = useState('danger')

  const showErrorToast = (message) => {
    setToastMessage(message)
    setToastColor('danger')
    setToast(toast + 1)
  }

  useEffect(() => {
    // console.log('ViewDealerDistributor Component - ID parameter:', id)
    fetchDealerData()
  }, [id])

  const fetchDealerData = async () => {
    try {
      setLoading(true)
    //   console.log('Fetching dealer data for ID:', id)
      const token = localStorage.getItem('token')
      const response = await getRequest(`users/${id}`, token)
    //   console.log('API Response:', response)
      
      if (response && (response.isSuccess || response.code === 200)) {
        const dealerData = response.data || response
            // console.log('Processed dealer data:', dealerData)
        setDealer(dealerData)
      } else {
        console.error('Invalid response format:', response)
        showErrorToast('Failed to load dealer data')
      }
    } catch (error) {
      console.error('Error fetching dealer data:', error)
      showErrorToast('Failed to load dealer data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <CContainer className="py-4">
      <CToaster position="top-end">
        {toast > 0 && (
          <CToast
            autohide={true}
            visible={true}
            color={toastColor}
            className="text-white align-items-center"
          >
            <CToastHeader closeButton>Error</CToastHeader>
            <CToastBody>{toastMessage}</CToastBody>
          </CToast>
        )}
      </CToaster>

      <CCard className="shadow-sm border-0">
        <CCardHeader className="bg-transparent py-3 d-flex justify-content-between align-items-center">
          <h4 className="m-0">Dealer/Distributor Details</h4>
          <CloseIcon style={{ cursor: 'pointer' }} onClick={() => navigate(-1)} />
        </CCardHeader>
        
        <CCardBody>
          {loading ? (
            <div className="text-center py-5">
              <CSpinner color="primary" />
              <p className="mt-3">Loading dealer details...</p>
            </div>
          ) : (
            <>
              <CNav variant="tabs" className="mb-4">
                <CNavItem>
                  <CNavLink 
                    active={activeTab === 1}
                    onClick={() => setActiveTab(1)}
                    style={{ cursor: 'pointer' }}
                  >
                    Personal Details
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink
                    active={activeTab === 2}
                    onClick={() => setActiveTab(2)}
                    style={{ cursor: 'pointer' }}
                  >
                    Dealership Details
                  </CNavLink>
                </CNavItem>
              </CNav>
              
              <CTabContent>
                <CTabPane visible={activeTab === 1} className="pt-3">
                  <CRow>
                    <CCol md={12}>
                      <h5 className="mb-3">Personal Details</h5>
                      <CTable bordered responsive>
                        <CTableBody>
                          <CTableRow>
                            <CTableHeaderCell style={{ width: '30%' }}>Firm Name</CTableHeaderCell>
                            <CTableDataCell>{dealer?.firmName || dealer?.fullName || 'N/A'}</CTableDataCell>
                          </CTableRow>
                          <CTableRow>
                            <CTableHeaderCell>Contact Person</CTableHeaderCell>
                            <CTableDataCell>{dealer?.contactPerson || dealer?.data?.contactPerson || 'N/A'}</CTableDataCell>
                          </CTableRow>
                          <CTableRow>
                            <CTableHeaderCell>Email</CTableHeaderCell>
                            <CTableDataCell>{dealer?.email || dealer?.data?.email || 'N/A'}</CTableDataCell>
                          </CTableRow>
                          <CTableRow>
                            <CTableHeaderCell>Contact Number</CTableHeaderCell>
                            <CTableDataCell>{dealer?.phone || dealer?.data?.phone || 'N/A'}</CTableDataCell>
                          </CTableRow>
                          <CTableRow>
                            <CTableHeaderCell>Current Address</CTableHeaderCell>
                            <CTableDataCell>{dealer?.address || dealer?.data?.address || 'N/A'}</CTableDataCell>
                          </CTableRow>
                          <CTableRow>
                            <CTableHeaderCell>Status</CTableHeaderCell>
                            <CTableDataCell>
                              <span className={`badge bg-${(dealer?.status || dealer?.data?.status) === 'active' ? 'success' : 'secondary'}`}>
                                {dealer?.status || dealer?.data?.status || 'Disabled'}
                              </span>
                            </CTableDataCell>
                          </CTableRow>
                          <CTableRow>
                            <CTableHeaderCell>Created by</CTableHeaderCell>
                            <CTableDataCell>
                              {dealer?.distributerId?.firmName || dealer?.distributerId?.fullName || 'Self'}
                            </CTableDataCell>
                          </CTableRow>
                        </CTableBody>
                      </CTable>
                    </CCol>
                  </CRow>
                </CTabPane>
                
                <CTabPane visible={activeTab === 2} className="pt-3">
                  <CRow>
                    <CCol md={12}>
                      <h5 className="mb-3">Dealership Details</h5>
                      <CTable bordered responsive>
                        <CTableBody>
                          <CTableRow>
                            <CTableHeaderCell style={{ width: '30%' }}>Country</CTableHeaderCell>
                            <CTableDataCell>{dealer?.country || dealer?.data?.country || 'N/A'}</CTableDataCell>
                          </CTableRow>
                          <CTableRow>
                            <CTableHeaderCell>State</CTableHeaderCell>
                            <CTableDataCell>{dealer?.state || dealer?.data?.state || 'N/A'}</CTableDataCell>
                          </CTableRow>
                          <CTableRow>
                            <CTableHeaderCell>City</CTableHeaderCell>
                            <CTableDataCell>{dealer?.city || dealer?.data?.city || 'N/A'}</CTableDataCell>
                          </CTableRow>
                          <CTableRow>
                            <CTableHeaderCell>Area</CTableHeaderCell>
                            <CTableDataCell>{dealer?.area || dealer?.data?.area || 'N/A'}</CTableDataCell>
                          </CTableRow>
                          {/* <CTableRow>
                            <CTableHeaderCell>Discount</CTableHeaderCell>
                            <CTableDataCell>{(dealer?.discountPercentage || dealer?.data?.discountPercentage) ? `${dealer?.discountPercentage || dealer?.data?.discountPercentage}%` : 'N/A'}</CTableDataCell>
                          </CTableRow> */}
                          <CTableRow>
                            <CTableHeaderCell>Admin Margin</CTableHeaderCell>
                            <CTableDataCell>{dealer?.marginPercent || dealer?.data?.marginPercent || 'N/A'}</CTableDataCell>
                          </CTableRow>
                          <CTableRow>
                            <CTableHeaderCell>GST No.</CTableHeaderCell>
                            <CTableDataCell>{dealer?.gstNumber|| dealer?.data?.gstNumber || 'N/A'}</CTableDataCell>
                          </CTableRow>
                          <CTableRow>
                            <CTableHeaderCell>Dist. Credit Limit</CTableHeaderCell>
                            <CTableDataCell>{(dealer?.creditLimit || dealer?.data?.creditLimit) ? `₹${dealer?.creditLimit || dealer?.data?.creditLimit}` : 'N/A'}</CTableDataCell>
                          </CTableRow>
                          <CTableRow>
                            <CTableHeaderCell>Due Days</CTableHeaderCell>
                            <CTableDataCell>{dealer?.dueDays || dealer?.data?.dueDays || 'N/A'}</CTableDataCell>
                          </CTableRow>
                        </CTableBody>
                      </CTable>
                    </CCol>
                  </CRow>
                </CTabPane>
              </CTabContent>
            </>
          )}
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default ViewDealerDistributor 