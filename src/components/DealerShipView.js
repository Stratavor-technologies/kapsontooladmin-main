import React from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CRow,
  CForm,
  CButton,
  CFormInput,
  CFormLabel,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import CloseIcon from '@mui/icons-material/Close'

const DealershipDetailsForm = () => {
  const navigate = useNavigate()
  return (
    <CContainer className="py-4">
      <CCard className="shadow-sm border-0">
        <CCardHeader className="bg-transparent py-3 d-flex justify-content-between">
          <h4 className="m-0">Dealership Details</h4>
          <CloseIcon style={{ cursor: 'pointer' }} onClick={() => navigate(-1)} />
        </CCardHeader>
        <CCardBody>
          <CForm>
            <CRow>
              <CCol md={6}>
                <CRow className="mb-3">
                  <CCol md={4}>
                    <CFormLabel className="col-form-label">Firm Name</CFormLabel>
                  </CCol>
                  <CCol md={8}>
                    <CFormInput
                      type="text"
                      placeholder="Enter Firm Name"
                      className="form-control-plaintext border-bottom"
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md={4}>
                    <CFormLabel className="col-form-label">Contact Person</CFormLabel>
                  </CCol>
                  <CCol md={8}>
                    <CFormInput
                      type="text"
                      placeholder="Enter Contact Person"
                      className="form-control-plaintext border-bottom"
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md={4}>
                    <CFormLabel className="col-form-label">Email</CFormLabel>
                  </CCol>
                  <CCol md={8}>
                    <CFormInput
                      type="email"
                      placeholder="Enter Email"
                      className="form-control-plaintext border-bottom"
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md={4}>
                    <CFormLabel className="col-form-label">Contact Number</CFormLabel>
                  </CCol>
                  <CCol md={8}>
                    <CFormInput
                      type="tel"
                      placeholder="Enter Contact Number"
                      className="form-control-plaintext border-bottom"
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md={4}>
                    <CFormLabel className="col-form-label">Current Address</CFormLabel>
                  </CCol>
                  <CCol md={8}>
                    <CFormInput
                      type="text"
                      placeholder="Enter Current Address"
                      className="form-control-plaintext border-bottom"
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md={4}>
                    <CFormLabel className="col-form-label">Status</CFormLabel>
                  </CCol>
                  <CCol md={8}>
                    <CFormInput
                      type="text"
                      value="Disabled"
                      readOnly
                      className="form-control-plaintext border-bottom"
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md={4}>
                    <CFormLabel className="col-form-label">Created by</CFormLabel>
                  </CCol>
                  <CCol md={8}>
                    <CFormInput
                      type="text"
                      placeholder="Enter Created by"
                      className="form-control-plaintext border-bottom"
                    />
                  </CCol>
                </CRow>
              </CCol>
              <CCol md={6}>
                <CRow className="mb-3">
                  <CCol md={4}>
                    <CFormLabel className="col-form-label">Country</CFormLabel>
                  </CCol>
                  <CCol md={8}>
                    <CFormInput
                      type="text"
                      placeholder="Enter Country"
                      className="form-control-plaintext border-bottom"
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md={4}>
                    <CFormLabel className="col-form-label">State</CFormLabel>
                  </CCol>
                  <CCol md={8}>
                    <CFormInput
                      type="text"
                      placeholder="Enter State"
                      className="form-control-plaintext border-bottom"
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md={4}>
                    <CFormLabel className="col-form-label">City</CFormLabel>
                  </CCol>
                  <CCol md={8}>
                    <CFormInput
                      type="text"
                      placeholder="Enter City"
                      className="form-control-plaintext border-bottom"
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md={4}>
                    <CFormLabel className="col-form-label">Area</CFormLabel>
                  </CCol>
                  <CCol md={8}>
                    <CFormInput
                      type="text"
                      placeholder="Enter Area"
                      className="form-control-plaintext border-bottom"
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md={4}>
                    <CFormLabel className="col-form-label">Discount</CFormLabel>
                  </CCol>
                  <CCol md={8}>
                    <CFormInput
                      type="text"
                      placeholder="Enter Discount"
                      className="form-control-plaintext border-bottom"
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md={4}>
                    <CFormLabel className="col-form-label">Admin Margin</CFormLabel>
                  </CCol>
                  <CCol md={8}>
                    <CFormInput
                      type="text"
                      value="N/A"
                      readOnly
                      className="form-control-plaintext border-bottom"
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md={4}>
                    <CFormLabel className="col-form-label">Gst No.</CFormLabel>
                  </CCol>
                  <CCol md={8}>
                    <CFormInput
                      type="text"
                      placeholder="Enter GST Number"
                      className="form-control-plaintext border-bottom"
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md={4}>
                    <CFormLabel className="col-form-label">Dist. Credit Limit</CFormLabel>
                  </CCol>
                  <CCol md={8}>
                    <CFormInput
                      type="text"
                      placeholder="Enter Credit Limit"
                      className="form-control-plaintext border-bottom"
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md={4}>
                    <CFormLabel className="col-form-label">Due Days</CFormLabel>
                  </CCol>
                  <CCol md={8}>
                    <CFormInput
                      type="text"
                      placeholder="Enter Due Days"
                      className="form-control-plaintext border-bottom"
                    />
                  </CCol>
                </CRow>
              </CCol>
            </CRow>
          </CForm>
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default DealershipDetailsForm
