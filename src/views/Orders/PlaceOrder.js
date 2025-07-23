import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CFormCheck,
} from '@coreui/react'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import PaymentIcon from '@mui/icons-material/Payment'
import { getRequest, postRequest } from 'src/Services/apiMethods'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

const PlaceOrder = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [cartItems, setCartItems] = useState([])
  const [products, setProducts] = useState({})
  const [cartId, setCartId] = useState('')
  const [userData, setUserData] = useState(null)
  const [useNewAddress, setUseNewAddress] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [orderId, setOrderId] = useState('')
  const [id, setId] = useState('')
  const navigate = useNavigate()
  // New address form state
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    phoneNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    isDefault: false,
  })

  // Fetch cart and user data
  useEffect(() => {
    fetchCart()
    fetchUserData()
  }, [])


  useEffect(() => {
    console.log('cartId', cartId)
  }, [cartId])

  const fetchCart = async () => {
    setLoading(true)
    const token = localStorage.getItem('token')
    try {
      const response = await getRequest('/carts/getCart/ByToken', token)

      if (response.isSuccess && response.code === 200) {
        setCartId(response.data._id)

        const items = response.data.items.map((item) => ({
          productId: item.productId._id,
          quantity: item.quantity,
          price: item.price,
          product: item.productId,
        }))
        setCartItems(items)

        // Create products object from items
        const productData = {}
        response.data.items.forEach((item) => {
          productData[item.productId._id] = {
            ...item.productId,
            id: item.productId._id,
            basePrice: item.productId.basicPrice,
          }
        })
        setProducts(productData)
      } else {
        setError('Failed to fetch cart')
      }
    } catch (err) {
      console.error('Error fetching cart:', err)
      setError('Failed to fetch cart')
    } finally {
      setLoading(false)
    }
  }

  const fetchUserData = async () => {
    setLoading(true)
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('id')
    const cleanUserId = userId?.replace(/['"]/g, '')

    if (!cleanUserId) {
      setError('User ID not found. Please login again.')
      setLoading(false)
      return
    }

    try {
      const response = await getRequest(`/users/${cleanUserId}`, token)
      console.log('User data response:', response)

      if (response.isSuccess && response.code === 200) {
        setUserData(response.data)

        // Pre-fill new address form with user data if available
        if (response.data) {
          setNewAddress((prev) => ({
            ...prev,
            fullName: response.data.firmName || response.data.fullName || '',
            phoneNumber: response.data.phone || '',
            addressLine1: response.data.address || '',
            city: response.data.state || '', // Using state field for city as a fallback
            state: response.data.state || '',
            postalCode: response.data.zipCode || '',
            country: response.data.country || 'India',
          }))
        }
      } else {
        console.error('Failed to fetch user data')
        setError('Failed to fetch user data')
      }
    } catch (err) {
      console.error('Error fetching user data:', err)
      setError('Error fetching user data')
    } finally {
      setLoading(false)
    }
  }

  const handleNewAddressToggle = () => {
    setUseNewAddress(!useNewAddress)
  }

  const handleNewAddressChange = (e) => {
    const { name, value, type, checked } = e.target
    setNewAddress({
      ...newAddress,
      [name]: type === 'checkbox' ? checked : value,
    })
  }
  // console.log("newAddress", newAddress)


  const calculateTotals = () => {
    return cartItems.reduce(
      (acc, item) => {
        const product = products[item.productId]
        if (!product) return acc

        const basePrice = product.basePrice || 0
        const itemTotal = basePrice * item.quantity

        return {
          totalItems: acc.totalItems + item.quantity,
          subtotal: acc.subtotal + itemTotal,
          total: acc.total + itemTotal,
        }
      },
      { totalItems: 0, subtotal: 0, total: 0 },
    )
  }

  const totals = calculateTotals()

  const handleSaveNewAddress = async () => {
    // Just update the state for now since we're not saving to a separate addresses collection
    setSuccess('Address information updated successfully')
    // In a real implementation, you might want to update the user profile with this address
  }
  const proceedToCheckout = async () => {
    if (!useNewAddress && (!userData || !userData.address)) {
      setError('Please add your shipping address')
      return
    }
    
    setLoading(true)
    const token = localStorage.getItem('token')
    const payload = {
      cartId: cartId,
      orderItems: cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    }
    
    try {
      const response = await postRequest(`/orders/proceedToCheckout/${cartId}`, payload, token)
      if (response.isSuccess && response.code === 200) {
        const newOrderId = response.data._id
        console.log('Generated Order ID:', newOrderId)
        setId(newOrderId)
        setOrderId(newOrderId)
        placeOrder(newOrderId)
      } else {
        setError(response.message || 'Failed to process checkout')
      }
    } catch (error) {
      console.error('Error creating order:', error)
      setError('Failed to process checkout')
    } finally {
      setLoading(false)
    }
  }

  const placeOrder = async (orderIdToUse) => {
    console.log('Using Order ID:', orderIdToUse)
    if(!orderIdToUse){
      setError('Order ID not found')
      return
    }
    setLoading(true)
    const token = localStorage.getItem('token')
    try {
      const payload = {
        partyDetails: {
          partyName: useNewAddress ? newAddress.fullName : (userData.firmName || userData.fullName),
          contactNo: useNewAddress ? newAddress.phoneNumber : userData.phone,
          email: userData.email,
          address: useNewAddress ? newAddress.addressLine1 : userData.address,
        },
        country: useNewAddress ? newAddress.country : userData.country,
        state: useNewAddress ? newAddress.state : userData.state,
        city: useNewAddress ? newAddress.city : userData.city || userData.state,
        zipCode: useNewAddress ? newAddress.postalCode : userData.zipCode,
        orderId: orderIdToUse,
      }
      console.log('Order payload:', payload)
  
      const response = await postRequest(`/orders/placeOrder/${orderIdToUse}`, payload, token)
  
      if (response.isSuccess && response.code === 200) {
        setSuccess('Order placed successfully!')
        navigate("/Orders/OtherOrders")
      } else {
        setError(response.message || 'Failed to place order')
      }
    } catch (err) {
      console.error('Error placing order:', err)
      setError('Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4 shadow-sm">
          <CCardHeader className="bg-primary text-white d-flex align-items-center">
            <ShoppingCartIcon className="me-2" />
            <strong>Checkout</strong>
          </CCardHeader>
          <CCardBody>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            {success && (
              <div className="alert alert-success" role="alert">
                {success}
              </div>
            )}
            {loading ? (
              <div className="text-center my-3">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="checkout-container">
                <div className="row">
                  <div className="col-md-8">
                    {/* Shipping Address Section */}
                    <div className="card mb-4 shadow-sm">
                      <div className="card-header bg-light">
                        <div className="d-flex align-items-center">
                          <LocationOnIcon className="me-2" />
                          <h5 className="mb-0">Shipping Address</h5>
                        </div>
                      </div>
                      <div className="card-body">
                        {userData && userData.address && (
                          <div className="mb-4">
                            <div className="card border mb-3">
                              <div className="card-body">
                                <CFormCheck
                                  type="radio"
                                  id="default-address"
                                  name="addressSelection"
                                  label={
                                    <div>
                                      <strong>{userData.fullName}</strong>
                                      <p className="mb-0">{userData.phone}</p>
                                      <p className="mb-0">
                                        {userData.address},{userData.state && `${userData.state}, `}
                                        {userData.zipCode && `${userData.zipCode}, `}
                                        {userData.country}
                                      </p>
                                    </div>
                                  }
                                  checked={!useNewAddress}
                                  onChange={() => setUseNewAddress(false)}
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="mb-3">
                          <CFormCheck
                            type="checkbox"
                            id="useNewAddress"
                            label="Use a different address for this order"
                            checked={useNewAddress}
                            onChange={handleNewAddressToggle}
                          />
                        </div>

                        {(useNewAddress || !userData?.address) && (
                          <CForm className="row g-3">
                            <CCol md={6}>
                              <CFormLabel htmlFor="fullName">Full Name</CFormLabel>
                              <CFormInput
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={newAddress.fullName}
                                onChange={handleNewAddressChange}
                                required
                              />
                            </CCol>
                            <CCol md={6}>
                              <CFormLabel htmlFor="phoneNumber">Phone Number</CFormLabel>
                              <CFormInput
                                type="text"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={newAddress.phoneNumber}
                                onChange={handleNewAddressChange}
                                required
                              />
                            </CCol>
                            <CCol md={12}>
                              <CFormLabel htmlFor="addressLine1">Address Line 1</CFormLabel>
                              <CFormInput
                                type="text"
                                id="addressLine1"
                                name="addressLine1"
                                placeholder="Street address, P.O. box"
                                value={newAddress.addressLine1}
                                onChange={handleNewAddressChange}
                                required
                              />
                            </CCol>
                            <CCol md={12}>
                              <CFormLabel htmlFor="addressLine2">Address Line 2</CFormLabel>
                              <CFormInput
                                type="text"
                                id="addressLine2"
                                name="addressLine2"
                                placeholder="Apartment, suite, unit, building, floor, etc."
                                value={newAddress.addressLine2}
                                onChange={handleNewAddressChange}
                              />
                            </CCol>
                            <CCol md={6}>
                              <CFormLabel htmlFor="city">City</CFormLabel>
                              <CFormInput
                                type="text"
                                id="city"
                                name="city"
                                value={newAddress.city}
                                onChange={handleNewAddressChange}
                                required
                              />
                            </CCol>
                            <CCol md={6}>
                              <CFormLabel htmlFor="state">State</CFormLabel>
                              <CFormInput
                                type="text"
                                id="state"
                                name="state"
                                value={newAddress.state}
                                onChange={handleNewAddressChange}
                                required
                              />
                            </CCol>
                            <CCol md={6}>
                              <CFormLabel htmlFor="postalCode">Postal Code</CFormLabel>
                              <CFormInput
                                type="text"
                                id="postalCode"
                                name="postalCode"
                                value={newAddress.postalCode}
                                onChange={handleNewAddressChange}
                                required
                              />
                            </CCol>
                            <CCol md={6}>
                              <CFormLabel htmlFor="country">Country</CFormLabel>
                              <CFormInput
                                type="text"
                                id="country"
                                name="country"
                                value={newAddress.country}
                                onChange={handleNewAddressChange}
                                required
                              />
                            </CCol>
                            <CCol xs={12}>
                              <CFormCheck
                                id="isDefault"
                                name="isDefault"
                                label="Save for future orders"
                                checked={newAddress.isDefault}
                                onChange={handleNewAddressChange}
                              />
                            </CCol>
                            <CCol xs={12}>
                              <CButton color="secondary" onClick={handleSaveNewAddress}>
                                Save Address
                              </CButton>
                            </CCol>
                          </CForm>
                        )}
                      </div>
                    </div>

                    {/* Payment Method Section */}
                    <div className="card mb-4 shadow-sm">
                      <div className="card-header bg-light">
                        <div className="d-flex align-items-center">
                          <PaymentIcon className="me-2" />
                          <h5 className="mb-0">Payment Method</h5>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="mb-3">
                          <CFormCheck
                            type="radio"
                            id="payment-cod"
                            name="paymentMethod"
                            label="Cash on Delivery (COD)"
                            value="cod"
                            checked={paymentMethod === 'cod'}
                            onChange={() => setPaymentMethod('cod')}
                          />
                        </div>
                        <div className="mb-3">
                          <CFormCheck
                            type="radio"
                            id="payment-online"
                            name="paymentMethod"
                            label="Online Payment"
                            value="online"
                            checked={paymentMethod === 'online'}
                            onChange={() => setPaymentMethod('online')}
                          />
                          {paymentMethod === 'online' && (
                            <div className="mt-3 ps-4">
                              <p className="text-muted">
                                Online payment options will be available after order placement.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Order Review Section */}
                    <div className="card mb-4 shadow-sm">
                      <div className="card-header bg-light">
                        <h5 className="mb-0">Order Review</h5>
                      </div>
                      <div className="card-body">
                        {cartItems.length === 0 ? (
                          <p>No items in cart</p>
                        ) : (
                          cartItems.map((item) => {
                            const product = products[item.productId]
                            if (!product) return null

                            return (
                              <div
                                key={item.productId}
                                className="d-flex justify-content-between align-items-center mb-3"
                              >
                                <div className="d-flex align-items-center">
                                  {product.productImage && product.productImage.length > 0 ? (
                                    <img
                                      src={product.productImage[0]}
                                      alt={product.productName}
                                      style={{
                                        width: '50px',
                                        height: '50px',
                                        objectFit: 'contain',
                                      }}
                                      className="me-3"
                                      onError={(e) => {
                                        e.target.onerror = null
                                        e.target.src = '/assets/images/product-placeholder.jpg'
                                      }}
                                    />
                                  ) : (
                                    <div
                                      className="me-3 bg-light rounded"
                                      style={{ width: '50px', height: '50px' }}
                                    ></div>
                                  )}
                                  <div>
                                    <h6 className="mb-0">{product.productName}</h6>
                                    <small className="text-muted">Qty: {item.quantity}</small>
                                  </div>
                                </div>
                                <div className="text-end">
                                  <h6 className="mb-0">
                                    ₹{(product.basePrice * item.quantity).toFixed(2)}
                                  </h6>
                                  <small className="text-muted">
                                    ₹{product.basePrice?.toFixed(2)} each
                                  </small>
                                </div>
                              </div>
                            )
                          })
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Order Summary Section */}
                  <div className="col-md-4">
                    <div className="card shadow-sm position-sticky" style={{ top: '20px' }}>
                      <div className="card-body">
                        <h5 className="card-title mb-4">Order Summary</h5>
                        <div className="d-flex justify-content-between mb-2">
                          <span className="text-muted">Items ({totals.totalItems})</span>
                          <strong>₹{totals.subtotal.toFixed(2)}</strong>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span className="text-muted">Shipping</span>
                          <strong>₹0.00</strong>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span className="text-muted">Tax</span>
                          <strong>₹0.00</strong>
                        </div>
                        <hr />
                        <div className="d-flex justify-content-between mb-3">
                          <h6 className="mb-0">Grand Total</h6>
                          <h6 className="mb-0">₹{totals.total.toFixed(2)}</h6>
                        </div>

                        <CButton
                          color="primary"
                          size="lg"
                          className="w-100 mb-3"
                          onClick={proceedToCheckout}
                          disabled={loading || (!userData?.address && !useNewAddress)}
                        >
                          {loading ? 'Processing...' : 'Place Order'}
                        </CButton>

                        <div className="mt-3">
                          <small className="text-muted">
                            By placing your order, you agree to our terms and conditions and privacy
                            policy.
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default PlaceOrder
