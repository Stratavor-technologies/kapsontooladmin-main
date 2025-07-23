import React, { useState, useEffect } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CButton } from '@coreui/react'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { postRequest, getRequest } from '../Services/apiMethods'
import { useNavigate } from 'react-router-dom'
const AddDealerDistributor = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [stateList, setStateList] = useState([])
  const [cityList, setCityList] = useState([])
  const [touchedFields, setTouchedFields] = useState({})

  const [formData, setFormData] = useState({
    firmName: '',
    contactPerson: '',
    phone: '',
    email: '',
    password: '',
    address: '',
    gstNumber: '',
    country: '',
    state: '',
    city: '',
    area: '',
    marginPercent: '',
    creditLimit: '',
    dueDays: '',
    role: '',
  })

  const validateField = (name, value) => {
    switch (name) {
      case 'firmName':
        return value.trim() === '' ? 'Firm name is required' :
          value.length < 3 ? 'Firm name must be at least 3 characters' : ''
      case 'contactPerson':
        return value.trim() === '' ? 'Contact person name is required' :
          value.length < 3 ? 'Contact person name must be at least 3 characters' : ''
      case 'phone':
        return value.trim() === '' ? 'Contact number is required' :
          !/^[0-9]{10}$/.test(value) ? 'Contact number must be 10 digits' : ''
      case 'email':
        return value.trim() === '' ? 'Email is required' :
          !/\S+@\S+\.\S+/.test(value) ? 'Please enter a valid email address' : ''
      case 'password':
        return value.trim() === '' ? 'Password is required' :
          value.length < 6 ? 'Password must be at least 6 characters' : ''
      case 'address':
        return value.trim() === '' ? 'Address is required' : ''
      case 'gstNumber':
        return value.trim() === '' ? 'GST number is required' :
          !/^[0-9A-Z]{15}$/.test(value) ? 'Please enter a valid 15-character GST number' : ''
      case 'country':
        return value.trim() === '' ? 'Please select a country' : ''
      case 'state':
        return value.trim() === '' ? 'Please select a state' : ''
      case 'city':
        return value.trim() === '' ? 'Please select a city' : ''
      case 'marginPercent':
        return value.trim() === '' ? 'Margin Percent is required' :
          isNaN(value) ? 'Margin Percent must be a number' : ''
      case 'creditLimit':
        return value.trim() === '' ? 'Credit limit is required' :
          isNaN(value) ? 'Credit limit must be a number' : ''
      case 'dueDays':
        return value.trim() === '' ? 'Due days is required' :
          isNaN(value) ? 'Due days must be a number' : ''
      default:
        return ''
    }
  }
  const getState = async () => {
    const response = await getRequest('/auths/state/list')
    // Convert the state object to an array of {id, name} objects
    const statesArray = Object.entries(response.data).map(([name, cities]) => ({
      id: name,
      name: name
    }))
    setStateList(statesArray)
    // console.log('States:', statesArray)
  }
  const getCity = async () => {
    if (!formData.state) {
      setCityList([])
      return
    }
    try {
      const response = await getRequest(`auths/city?state=${formData.state}`)
      // console.log('Cities response:', response)
      if (response && Array.isArray(response)) {
        setCityList(response)
      }
    } catch (error) {
      console.error('Error fetching cities:', error)
      setCityList([])
    }
  }
  useEffect(() => {
    getState()
  }, [])

  useEffect(() => {
    getCity()
  }, [formData.state])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
      // Reset city when state changes
      ...(name === 'state' && { city: '' })
    })

    // Mark field as touched
    setTouchedFields({
      ...touchedFields,
      [name]: true
    })

    // Validate field and update errors
    const error = validateField(name, value)
    setErrors({
      ...errors,
      [name]: error
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
  
    // Validate all fields before submission
    const newErrors = {}
    const allTouched = {}
  
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key])
      if (error) newErrors[key] = error
      allTouched[key] = true
    })
  
    setErrors(newErrors)
    setTouchedFields(allTouched)
  
    if (Object.keys(newErrors).length === 0) {
      // Get user role from localStorage
      const userRole = localStorage.getItem('role')
      const token = localStorage.getItem('token')
  
      // Prepare the payload
      let payload = { ...formData }
  
      // If user is not admin, add distributor ID as string
      if (userRole !== 'ADMIN') {
        const distributorId = localStorage.getItem('id')
        const DsiID = distributorId?.replace(/"/g, '')
        payload = {
          ...formData,
          distributerId: String(DsiID) // Ensure it's a string
        }
      }
  
      console.log('Form submitted:', payload)
      
      try {
        const response = await postRequest('users/create', payload, token)
        console.log('API Response:', response)
        
        // Check for success in the response message
        if (response && (response.status === 200 || response.message === 'success' || response === 'success')) {
          console.log('Navigation triggered to /DealersDistributors')
          navigate('/DealersDistributors')
        } else {
          console.error('API error:', response)
          alert('Failed to add Dealer/Distributor: ' + (typeof response === 'string' ? response : JSON.stringify(response)))
        }
      } catch (error) {
        console.error('Error submitting form:', error)
        alert('Failed to add Dealer/Distributor: ' + (error?.message || 'Unknown error'))
      }
    }
  }

  // Custom styles
  const formGroupStyle = {
    marginBottom: '1rem',
    position: 'relative',
  }

  const inputStyle = {
    display: 'block',
    width: '100%',
    padding: '0.375rem 0.75rem',
    fontSize: '1rem',
    lineHeight: '1.5',
    backgroundClip: 'padding-box',
    borderRadius: '0.25rem',
    transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
    border: '1px solid #ced4da',
  }

  const errorStyle = {
    color: 'red',
    fontSize: '0.875rem',
    marginTop: '0.25rem',
  }

  const passwordToggleStyle = {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    zIndex: 1,
    color: '#666',
    display: 'flex',
    alignItems: 'center',
  }

  const labelStyle = {
    marginBottom: '0.5rem',
    display: 'inline-block',
  }

  const selectStyle = {
    ...inputStyle,
    height: 'calc(1.5em + 0.75rem + 2px)',
  }

  // Helper function to determine if we should show error for a field
  const shouldShowError = (fieldName) => {
    return touchedFields[fieldName] && errors[fieldName];
  }

  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CCard className="w-100">
        <CCardHeader>
          <h4>Add Dealer / Distributor</h4>
        </CCardHeader>
        <CCardBody>
          <div className="mt-2 mb-4">
            <small>
              Fields marked with <span style={{ color: 'red' }}>*</span> are required
            </small>
          </div>

          <h5 style={{ marginBottom: '1.5rem' }}>Personal Details</h5>
          <form onSubmit={handleSubmit}>
            <CRow>
              <CCol md="6">
                <div style={formGroupStyle}>
                  <label htmlFor="firmName" style={labelStyle}>
                    Firm Name <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    style={{
                      ...inputStyle,
                      borderColor: shouldShowError('firmName') ? 'red' : '#ced4da',
                    }}
                    type="text"
                    id="firmName"
                    name="firmName"
                    value={formData.firmName}
                    onChange={handleChange}
                    placeholder="Firm Name"
                    required
                  />
                  {shouldShowError('firmName') && <div style={errorStyle}>{errors.firmName}</div>}
                </div>
              </CCol>
              <CCol md="6">
                <div style={formGroupStyle}>
                  <label htmlFor="contactPerson" style={labelStyle}>
                    Contact Person <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    style={{
                      ...inputStyle,
                      borderColor: shouldShowError('contactPerson') ? 'red' : '#ced4da',
                    }}
                    type="text"
                    id="contactPerson"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    placeholder="Contact Person"
                    required
                  />
                  {shouldShowError('contactPerson') && <div style={errorStyle}>{errors.contactPerson}</div>}
                </div>
              </CCol>
            </CRow>

            <CRow>
              <CCol md="4">
                <div style={formGroupStyle}>
                  <label htmlFor="phone" style={labelStyle}>
                    Contact No. <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    style={{
                      ...inputStyle,
                      borderColor: shouldShowError('phone') ? 'red' : '#ced4da',
                    }}
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Contact Number"
                    required
                  />
                  {shouldShowError('phone') && <div style={errorStyle}>{errors.phone}</div>}
                </div>
              </CCol>
              <CCol md="4">
                <div style={formGroupStyle}>
                  <label htmlFor="email" style={labelStyle}>
                    Email <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    style={{
                      ...inputStyle,
                      borderColor: shouldShowError('email') ? 'red' : '#ced4da',
                    }}
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                  />
                  {shouldShowError('email') && <div style={errorStyle}>{errors.email}</div>}
                </div>
              </CCol>
              <CCol md="4">
                <div style={formGroupStyle}>
                  <label htmlFor="password" style={labelStyle}>
                    Password <span style={{ color: 'red' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      style={{
                        ...inputStyle,
                        borderColor: shouldShowError('password') ? 'red' : '#ced4da',
                        paddingRight: '40px'
                      }}
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Password"
                      required
                    />
                    <span
                      style={passwordToggleStyle}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </span>
                  </div>
                  {shouldShowError('password') && <div style={errorStyle}>{errors.password}</div>}
                </div>
              </CCol>
            </CRow>

            <CRow>
              <CCol md="6">
                <div style={formGroupStyle}>
                  <label htmlFor="address" style={labelStyle}>
                    Address <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    style={{
                      ...inputStyle,
                      borderColor: shouldShowError('address') ? 'red' : '#ced4da',
                    }}
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Address"
                    required
                  />
                  {shouldShowError('address') && <div style={errorStyle}>{errors.address}</div>}
                </div>
              </CCol>
              <CCol md="6">
                <div style={formGroupStyle}>
                  <label htmlFor="gstNumber" style={labelStyle}>
                    GST Number <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    style={{
                      ...inputStyle,
                      borderColor: shouldShowError('gstNumber') ? 'red' : '#ced4da',
                    }}
                    type="text"
                    id="gstNumber"
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={handleChange}
                    placeholder="GST Number"
                    required
                  />
                  {shouldShowError('gstNumber') && <div style={errorStyle}>{errors.gstNumber}</div>}
                </div>
              </CCol>
            </CRow>

            <h5 style={{ margin: '1.5rem 0' }}>Dealership Details</h5>

            <CRow>
              <CCol md="6">
                <div style={formGroupStyle}>
                  <label htmlFor="country" style={labelStyle}>
                    Country <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    style={{
                      ...inputStyle,
                      borderColor: shouldShowError('country') ? 'red' : '#ced4da',
                    }}
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Country"
                    required
                  />
                  {shouldShowError('country') && <div style={errorStyle}>{errors.country}</div>}
                </div>
              </CCol>
              <CCol md="6">
                <div style={formGroupStyle}>
                  <label htmlFor="state" style={labelStyle}>
                    Select State <span style={{ color: 'red' }}>*</span>
                  </label>
                  <select
                    style={{
                      ...selectStyle,
                      borderColor: shouldShowError('state') ? 'red' : '#ced4da',
                    }}
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Please select</option>
                    {stateList.map((state) => (
                      <option key={state.id} value={state.id}>{state.name}</option>
                    ))}
                  </select>
                  {shouldShowError('state') && <div style={errorStyle}>{errors.state}</div>}
                </div>
              </CCol>
            </CRow>

            <CRow>
              <CCol md="6">
                <div style={formGroupStyle}>
                  <label htmlFor="city" style={labelStyle}>
                    Select City <span style={{ color: 'red' }}>*</span>
                  </label>
                  <select
                    style={{
                      ...selectStyle,
                      borderColor: shouldShowError('city') ? 'red' : '#ced4da',
                    }}
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Please select</option>
                    {cityList.map((city, index) => (
                      <option key={index} value={city}>{city}</option>
                    ))}
                  </select>
                  {shouldShowError('city') && <div style={errorStyle}>{errors.city}</div>}
                </div>
              </CCol>
              <CCol md="6">
                <div style={formGroupStyle}>
                  <label htmlFor="area" style={labelStyle}>
                    Area
                  </label>
                  <input
                    style={{
                      ...inputStyle,
                      borderColor: shouldShowError('area') ? 'red' : '#ced4da',
                    }}
                    type="text"
                    id="area"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    placeholder="Area"
                  />
                  {shouldShowError('area') && <div style={errorStyle}>{errors.area}</div>}
                </div>
              </CCol>
            </CRow>

            <CRow>
              <CCol md="6">
                <div style={formGroupStyle}>
                  <label htmlFor="marginPercent" style={labelStyle}>
                    Margin % <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    style={{
                      ...inputStyle,
                      borderColor: shouldShowError('marginPercent') ? 'red' : '#ced4da',
                    }}
                    type="text"
                    id="marginPercent"
                    name="marginPercent"
                    value={formData.marginPercent}
                    onChange={handleChange}
                    placeholder="Margin %"
                    required
                  />
                  {shouldShowError('marginPercent') && <div style={errorStyle}>{errors.marginPercent}</div>}
                </div>
              </CCol>
              <CCol md="6">
                <div style={formGroupStyle}>
                  <label htmlFor="creditLimit" style={labelStyle}>
                    Credit Limit <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    style={{
                      ...inputStyle,
                      borderColor: shouldShowError('creditLimit') ? 'red' : '#ced4da',
                    }}
                    type="text"
                    id="creditLimit"
                    name="creditLimit"
                    value={formData.creditLimit}
                    onChange={handleChange}
                    placeholder="Credit Limit"
                    required
                  />
                  {shouldShowError('creditLimit') && <div style={errorStyle}>{errors.creditLimit}</div>}
                </div>
              </CCol>
            </CRow>

            <CRow>
              <CCol md="6">
                <div style={formGroupStyle}>
                  <label htmlFor="dueDays" style={labelStyle}>
                    Due Days <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    style={{
                      ...inputStyle,
                      borderColor: shouldShowError('dueDays') ? 'red' : '#ced4da',
                    }}
                    type="text"
                    id="dueDays"
                    name="dueDays"
                    value={formData.dueDays}
                    onChange={handleChange}
                    placeholder="Due Days"
                    required
                  />
                  {shouldShowError('dueDays') && <div style={errorStyle}>{errors.dueDays}</div>}
                </div>
              </CCol>
              <CCol md="6">
                <div style={formGroupStyle}>
                  <label htmlFor="role" style={labelStyle}>
                    Customer Type
                  </label>
                  <select
                    style={{
                      ...selectStyle,
                      borderColor: shouldShowError('role') ? 'red' : '#ced4da',
                    }}
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="">Please select</option>
                    {localStorage.getItem('role') === 'ADMIN' ? (
                      <option value="DISTRIBUTER">Distributor</option>
                    ) : (
                      <option value="DEALER">Dealer</option>
                    )}
                  </select>
                  {shouldShowError('role') && <div style={errorStyle}>{errors.role}</div>}
                </div>
              </CCol>
            </CRow>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1.5rem' }}>
              <CButton type="button" color="secondary" onClick={() => navigate('/DealersDistributors')}>Cancel</CButton>
              <CButton type="submit" color="primary">
                Submit
              </CButton>
            </div>
          </form>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default AddDealerDistributor