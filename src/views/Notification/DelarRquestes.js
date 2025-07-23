import React, { useState } from 'react'
import {
  CCard,
  CCardHeader,
  CContainer,
  CRow,
  CCol,
  CCollapse,
  CCardBody,
  CButton,
} from '@coreui/react'
import { cilTrash, cilHome } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const DelarRquestes = () => {
  // Sample dealership requests data
  const [dealershipRequests, setDealershipRequests] = useState([
    {
      id: 1,
      title: 'DEALERSHIP REQUEST FROM N6UZMC0PSH',
      date: '26-11-2024',
      isOpen: false,
      personal: {
        from: 'N6uZmc0PSh',
        email: 'shadowtimer@yahoo.com',
        contact: 'GTFxACZOrnv',
        qualification: 'RDPnJrRTVJwzF',
        address: '',
      },
      dealership: {
        country: 'EogPZSRup',
        state: 'ISRTwZWRD',
        city: 'JAWpuDNOtUdL',
        area: 'AlQcHyrBX6z',
        currentBusiness: '',
        annualTurnover: '0',
      },
      comments: '',
    },
    {
      id: 2,
      title: 'DEALERSHIP REQUEST FROM',
      date: '26-11-2024',
      isOpen: false,
      personal: {
        from: '',
        email: '',
        contact: '',
        qualification: '',
        address: '',
      },
      dealership: {
        country: '',
        state: '',
        city: '',
        area: '',
        currentBusiness: '',
        annualTurnover: '',
      },
      comments: '',
    },
    {
      id: 3,
      title:
        'DEALERSHIP REQUEST FROM ? YOU HAVE RECEIVED 1 MESSAGE(-S) ? 947. GO > OUT CARROTUEST-MAIL 10/R?HASH-YXBWPTYMDC¥JMNVBNZLCNMHDGLVBJOXNZKZ0TE',
      date: '27-11-2024',
      isOpen: false,
      personal: {
        from: '',
        email: '',
        contact: '',
        qualification: '',
        address: '',
      },
      dealership: {
        country: '',
        state: '',
        city: '',
        area: '',
        currentBusiness: '',
        annualTurnover: '',
      },
      comments: '',
    },
    {
      id: 4,
      title: 'DEALERSHIP REQUEST FROM',
      date: '27-11-2024',
      isOpen: false,
      personal: {
        from: '',
        email: '',
        contact: '',
        qualification: '',
        address: '',
      },
      dealership: {
        country: '',
        state: '',
        city: '',
        area: '',
        currentBusiness: '',
        annualTurnover: '',
      },
      comments: '',
    },
    {
      id: 5,
      title: 'DEALERSHIP REQUEST FROM PEUIWDBFO',
      date: '27-11-2024',
      isOpen: false,
      personal: {
        from: '',
        email: '',
        contact: '',
        qualification: '',
        address: '',
      },
      dealership: {
        country: '',
        state: '',
        city: '',
        area: '',
        currentBusiness: '',
        annualTurnover: '',
      },
      comments: '',
    },
  ])

  // Toggle request details open/close
  const toggleRequest = (id) => {
    setDealershipRequests(
      dealershipRequests.map((request) =>
        request.id === id ? { ...request, isOpen: !request.isOpen } : { ...request, isOpen: false },
      ),
    )
  }

  // Delete request
  const deleteRequest = (id, event) => {
    event.stopPropagation()
    setDealershipRequests(dealershipRequests.filter((request) => request.id !== id))
  }

  return (
    <CContainer fluid className="min-vh-100">
      <div className="mb-3 mt-4">
        <h2 className="mb-0">Dealership Requests</h2>
      </div>

      {/* List of dealership requests */}
      {dealershipRequests.map((request) => (
        <div key={request.id} className="mb-3">
          <CCard
            className="mb-0 border-0"
            onClick={() => toggleRequest(request.id)}
            style={{ cursor: 'pointer' }}
          >
            <CCardHeader
              className="d-flex justify-content-between align-items-center"
              style={{
                border: '1px solid #233240',
                padding: '10px 15px',
              }}
            >
              <div>{request.title}</div>
              <div style={{ fontSize: '14px' }}>Date: {request.date}</div>
            </CCardHeader>
          </CCard>

          <CCollapse visible={request.isOpen}>
            <CCard className="border-0 mb-0">
              <CCardBody
                style={{
                  borderTop: 'none',
                }}
              >
                <h5 className="mb-3">DEALERSHIP REQUEST FORM WEBSITE</h5>

                <CRow>
                  <CCol md={6}>
                    <h6 className="text-danger mb-3">Personal Details</h6>
                    <div className="mb-2">
                      <strong>From:</strong> {request.personal.from || '-'}
                    </div>
                    <div className="mb-2">
                      <strong>Email:</strong> {request.personal.email || '-'}
                    </div>
                    <div className="mb-2">
                      <strong>Contact:</strong> {request.personal.contact || '-'}
                    </div>
                    <div className="mb-2">
                      <strong>Qualification:</strong> {request.personal.qualification || '-'}
                    </div>
                    <div className="mb-2">
                      <strong>Address:</strong> {request.personal.address || '-'}
                    </div>
                  </CCol>
                  <CCol md={6}>
                    <h6 className="text-danger mb-3">Dealership Details</h6>
                    <div className="mb-2">
                      <strong>Country:</strong> {request.dealership.country || '-'}
                    </div>
                    <div className="mb-2">
                      <strong>State:</strong> {request.dealership.state || '-'}
                    </div>
                    <div className="mb-2">
                      <strong>City:</strong> {request.dealership.city || '-'}
                    </div>
                    <div className="mb-2">
                      <strong>Area:</strong> {request.dealership.area || '-'}
                    </div>
                    <div className="mb-2">
                      <strong>Current Business:</strong> {request.dealership.currentBusiness || '-'}
                    </div>
                    <div className="mb-2">
                      <strong>Annual Turnover:</strong> {request.dealership.annualTurnover || '-'}
                    </div>
                  </CCol>
                </CRow>

                <div className="mt-3">
                  <strong>Comments:</strong> {request.comments || '-'}
                </div>

                <div className="d-flex justify-content-end mt-3">
                  <CButton color="danger" size="sm" onClick={(e) => deleteRequest(request.id, e)}>
                    <CIcon icon={cilTrash} /> Delete
                  </CButton>
                </div>
              </CCardBody>
            </CCard>
          </CCollapse>
        </div>
      ))}
    </CContainer>
  )
}

export default DelarRquestes
