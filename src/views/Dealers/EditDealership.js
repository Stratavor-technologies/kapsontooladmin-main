import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CRow,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CButton,
} from '@coreui/react'
import { useParams, useNavigate } from 'react-router-dom'
import { getRequest, putRequest } from '../../Services/apiMethods'

const EditDealershipForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [formData, setFormData] = useState({
    firmName: '',
    contactPerson: '',
    contactNo: '',
    address: '',
    email: '',
    gstNumber: '',
    country: '',
    state: '',
    city: '',
    area: '',
    margin: '',
    role: '',
    discountPercentage: '',
    creditLimit: '',
    dueDays: '',
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }
  const getDealerData = async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await getRequest(`users/${id}`, token)
      console.log('Dealer Data:', response.data)
      if (response && (response.isSuccess || response.code === 200)) {
        const dealerData = response.data || response
        setFormData({
          firmName: dealerData.firmName || '',
          contactPerson: dealerData.contactPerson || '',
          contactNo: dealerData.phone || '',
          address: dealerData.address || '',
          email: dealerData.email || '',
          gstNumber: dealerData.gstNumber || '',
          country: dealerData.country || '',
          state: dealerData.state || '',
          city: dealerData.city || '',
          margin: dealerData.marginPercent || '',
          area: dealerData.area || '',
          role: dealerData.role || '',
          // discountPercentage: dealerData.discountPercentage || '',
          creditLimit: dealerData.creditLimit || '',
          dueDays: dealerData.dueDays || '',
        })
      }
    } catch (error) {
      console.error('Error fetching dealer data:', error)
    }
  }
  useEffect(() => {
    getDealerData()
  }, [])
  const handleUpdate = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    console.log('Form Data:', formData)
    try {
      const response = await putRequest(`users/${id}`, formData, token)
      console.log('Update Response:', response)
      navigate('/DealersDistributors')
    } catch (error) {
      console.error('Error updating dealer:', error)
    }
  }

  return (
    <div className="py-4">
      <CContainer>
        <CRow className="">
          <CCol>
            <CCard className=" bg-transparent border-0">
              <CCardHeader className=" bg-transparent border-0 pb-0">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="m-0">Fields marked with (*) are required</h5>
                </div>
              </CCardHeader>
              <CCardBody>
                <CForm>
                  <CRow>
                    <CCol md={6}>
                      <h6 className=" mb-3">Personal Details</h6>
                      <CRow className="mb-3">
                        <CCol>
                          <CFormLabel className="">Firm Name*</CFormLabel>
                          <CFormInput
                            type="text"
                            name="firmName"
                            value={formData.firmName}
                            onChange={handleInputChange}
                            className="bg-transparent border-secondary"
                            placeholder="Enter Firm Name"
                            required
                          />
                        </CCol>
                        <CCol>
                          <CFormLabel className="">Contact Person*</CFormLabel>
                          <CFormInput
                            type="text"
                            name="contactPerson"
                            value={formData.contactPerson}
                            onChange={handleInputChange}
                            className="bg-transparent  border-secondary"
                            placeholder="Enter Contact Person"
                            required
                          />
                        </CCol>
                      </CRow>
                      <CRow className="mb-3">
                        <CCol>
                          <CFormLabel className="">Contact No.*</CFormLabel>
                          <CFormInput
                            type="tel"
                            name="contactNo"
                            value={formData.contactNo}
                            onChange={handleInputChange}
                            className="bg-transparent  border-secondary"
                            placeholder="Enter Contact Number"
                            required
                          />
                        </CCol>
                        <CCol>
                          <CFormLabel className="">Email*</CFormLabel>
                          <CFormInput
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="bg-transparent  border-secondary"
                            placeholder="Enter Email"
                            required
                          />
                        </CCol>
                      </CRow>
                      <CRow className="mb-3">
                        <CCol>
                          <CFormLabel className="">Complete Address*</CFormLabel>
                          <CFormInput
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="bg-transparent  border-secondary"
                            placeholder="Enter Complete Address"
                            required
                          />
                        </CCol>
                        <CCol>
                          <CFormLabel className="">GST No.*</CFormLabel>
                          <CFormInput
                            type="text"
                            name="gstNumber"
                            value={formData.gstNumber}
                            onChange={handleInputChange}
                            className="bg-transparent  border-secondary"
                            placeholder="Enter GST Number"
                            required
                          />
                        </CCol>
                      </CRow>
                      <CRow>
                        <CCol>
                        <CFormLabel className="">Margin*</CFormLabel>
                          <CFormInput
                            type="text"
                            name="margin"
                            value={formData.margin}
                            onChange={handleInputChange}
                            className="bg-transparent  border-secondary"
                            placeholder="Enter Margin"
                            required
                          />

                        </CCol>
                      </CRow>
                    </CCol>
                    <CCol md={6}>
                      <h6 className=" mb-3">Dealership Details</h6>
                      <CRow className="mb-3">
                        <CCol>
                          <CFormLabel className="">Select Country*</CFormLabel>
                          {/* <CFormSelect
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            className="bg-transparent  border-secondary"
                            required
                          >
                            <option value="">Select Country</option>
                            <option value="india">India</option>
                          </CFormSelect> */}
                          <CFormInput
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            className="bg-transparent  border-secondary"  
                            placeholder="Enter Country"
                            required
                          />
                        </CCol>
                        <CCol>
                          <CFormLabel className="">Select State*</CFormLabel>
                          {/* <CFormSelect
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            className="bg-transparent  border-secondary"
                            required
                          >
                            <option value="">Select State</option>
                            <option value="maharashtra">Maharashtra</option>
                          </CFormSelect> */}
                          <CFormInput
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            className="bg-transparent  border-secondary"  
                            placeholder="Enter State"
                            required
                          />
                        </CCol>
                      </CRow>
                      <CRow className="mb-3">
                        <CCol>
                          <CFormLabel className="">Select City*</CFormLabel>
                          {/* <CFormSelect
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="bg-transparent  border-secondary"
                            required
                          >
                            <option value="">Select City</option>
                            <option value="mumbai">Mumbai</option>
                          </CFormSelect> */}
                          <CFormInput
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="bg-transparent  border-secondary"    
                            placeholder="Enter City"
                            required
                          />
                        </CCol>
                        <CCol>
                          <CFormLabel className="">Area*</CFormLabel>
                          <CFormInput
                            type="text"
                            name="area"
                            value={formData.area}
                            onChange={handleInputChange}
                            className="bg-transparent  border-secondary"
                            placeholder="Enter Area"
                            required
                          />
                        </CCol>
                      </CRow>
                      <CRow className="mb-3">
                        <CCol>
                          <CFormLabel className="">Customer Type*</CFormLabel>
                          {/* <CFormSelect
                            name="customerType"
                            value={formData.customerType}
                            onChange={handleInputChange}
                            className="bg-transparent  border-secondary"
                            required
                          >
                            <option value="">Select One</option>
                            <option value="regular">Regular</option>
                            <option value="wholesale">Wholesale</option>
                          </CFormSelect> */}
                          <CFormInput
                            type="text"
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            className="bg-transparent  border-secondary"      
                            placeholder="Enter Customer Type"
                            required
                          />
                        </CCol>
                        {/* <CCol>
                          <CFormLabel className="">Discount*</CFormLabel>
                          <CFormInput
                            type="number"
                            name="discountPercentage"
                            value={formData.discountPercentage || ''}
                            onChange={handleInputChange}
                            className="bg-transparent  border-secondary"
                            placeholder="Enter Discount"
                            required
                          />
                        </CCol> */}
                      </CRow>
                      <CRow className="mb-3">
                        <CCol>
                          <CFormLabel className="">Credit Limit*</CFormLabel>
                          <CFormInput
                            type="number"
                            name="creditLimit"
                            value={formData.creditLimit || ''}
                            onChange={handleInputChange}
                            className="bg-transparent  border-secondary"
                            placeholder="Enter Credit Limit"
                            required
                          />
                        </CCol>
                        <CCol>
                          <CFormLabel className="">Due Days*</CFormLabel>
                          <CFormInput
                            type="number"
                            name="dueDays"
                            value={formData.dueDays || ''}
                            onChange={handleInputChange}
                            className="bg-transparent  border-secondary"
                            placeholder="Enter Due Days"
                            required
                          />
                        </CCol>
                      </CRow>
                    </CCol>
                  </CRow>
                  <CRow className="mt-3">
                    <CCol className="text-end gap-2">
                      <CButton
                        className="btn "
                        style={{
                          // background: '#FF5722',
                          marginRight: '10px',
                          borderColor: 'black',
                        }}
                        onClick={() => {
                          window.history.back()
                        }}
                      >
                        Cancel
                      </CButton>
                      <CButton
                        type="submit"
                        color="primary"
                        className="btn"
                        onClick={handleUpdate}
                        style={
                          {
                            // background: '#FF5722',
                            // borderColor: '#FF5722',
                          }
                        }
                      >
                        Update
                      </CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default EditDealershipForm
