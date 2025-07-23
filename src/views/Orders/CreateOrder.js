import React, { useState, useEffect } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CButton } from '@coreui/react'
import DeleteIcon from '@mui/icons-material/Delete'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { getRequest, deleteRequest,putRequest, postRequest } from 'src/Services/apiMethods'
import { useNavigate } from 'react-router-dom'

const CreateOrder = () => {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [products, setProducts] = useState({})
  const [cartId, setCartId] = useState('')
  const Navigate = useNavigate()

  const fetchCart = async () => {
    setLoading(true)
    const token = localStorage.getItem('token')
    try {
      const response = await getRequest('/carts/getCart/ByToken', token)
      setCartId(response.data._id)
      // console.log('Cart ID:', cartId)
      if (response.isSuccess && response.code === 200) {
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

  useEffect(() => {
    fetchCart()
  }, [])

  const handleRemoveItem = (productId) => {
    const updatedItems = cartItems.filter((item) => item.productId !== productId)
    const token = localStorage.getItem('token')
    const payload = {
      productId: productId,
      quantity: 1,
    }
    console.log('Payload:', payload)
    console.log('Cart ID:', cartId)

    const response = deleteRequest(`carts/delete/${cartId}`, payload, token)
    if (response.isSuccess && response.code === 200) {
      console.log('Item removed successfully')
      fetchCart()
    } else {
      console.error('Failed to remove item')
    }
    setError('')
    setCartItems(updatedItems)
  }

  const handleQuantityChange = (productId, newQuantity) => {
    const product = products[productId]
    if (!product) {
      setError(`Product not found`)
      return
    }

    // Convert to a number and validate
    newQuantity = parseInt(newQuantity)
    if (isNaN(newQuantity) || newQuantity < 1) {
      newQuantity = 1
    }

    if (newQuantity > product.stock) {
      setError(`Only ${product.stock} items available in stock`)
      return
    }

    const updatedItems = cartItems.map((item) => {
      if (item.productId === productId) {
        const price = product.basePrice * newQuantity
        return { ...item, quantity: newQuantity, price }
      }
      return item
    })
    setCartItems(updatedItems)
    setError('')
  }

  const calculateTotals = () => {
    return cartItems.reduce(
      (acc, item) => {
        const product = products[item.productId]
        // Skip calculation if product doesn't exist
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

  // Fallback image for missing product images
  const fallbackProductImage = '/assets/images/product-placeholder.jpg'
  const proccedtoCheckout = async () => {
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
        // console.log('Order created successfully:', response.data)
        // Extract the order ID from the response and pass it in the URL
        const orderId = response.data._id
        Navigate(`/PlaceOrder/${orderId}`)
      } else {
        console.error('Failed to create order:', response.message)
      }
    } catch (error) {
      console.error('Error creating order:', error)
    }
  }
  const UpdateCart = async () => {
    const token = localStorage.getItem('token')
    const payload = {
      // cartId: cartId,
      items: cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    }
    try {
      const response = await putRequest(`/carts/${cartId}`, payload, token)
      if (response.isSuccess && response.code === 200) {
        // console.log('Cart updated successfully:', response.data)
        // proccedtoCheckout()
        Navigate(`/PlaceOrder/${cartId}`)
      } else {
        console.error('Failed to update cart:', response.message)
      }
    } catch (error) {
      console.error('Error updating cart:', error)
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4 shadow-sm">
          <CCardHeader className="bg-primary text-white d-flex align-items-center">
            <ShoppingCartIcon className="me-2" />
            <strong>Shopping Cart</strong>
          </CCardHeader>
          <CCardBody>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            {loading ? (
              <div className="text-center my-3">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="text-center my-5">
                <ShoppingCartIcon style={{ fontSize: '48px', color: '#6c757d' }} />
                <p className="mt-3 text-muted">Your cart is empty</p>
                <CButton color="primary" className="mt-2">
                  Continue Shopping
                </CButton>
              </div>
            ) : (
              <div className="cart-container">
                <div className="row">
                  <div className="col-md-8">
                    {cartItems.map((item) => {
                      const product = products[item.productId]

                      // Skip rendering if product doesn't exist
                      if (!product) return null

                      const basePrice = product.basePrice
                      const itemTotal = basePrice * item.quantity

                      return (
                        <div key={item.productId} className="card mb-3 shadow-sm">
                          <div className="card-body">
                            <div className="row align-items-center">
                              <div className="col-md-2">
                                {product.productImage && product.productImage.length > 0 ? (
                                  <img
                                    src={product.productImage[0]}
                                    alt={product.productName || 'Product'}
                                    className="img-fluid rounded"
                                    style={{ maxHeight: '80px', objectFit: 'contain' }}
                                    onError={(e) => {
                                      e.target.onerror = null
                                      e.target.src = fallbackProductImage
                                    }}
                                  />
                                ) : (
                                  <div className="text-center p-3 bg-light rounded">
                                    <span className="text-muted">No image</span>
                                  </div>
                                )}
                              </div>
                              <div className="col-md-4">
                                <h6 className="mb-1">
                                  {product.productName || `Product #${item.productId}`}
                                </h6>
                                {product.ArtNumber && (
                                  <small className="text-muted d-block">
                                    Art#: {product.ArtNumber}
                                  </small>
                                )}
                                {product.productDescription && (
                                  <small className="text-muted d-block">
                                    {product.productDescription}
                                  </small>
                                )}
                              </div>
                              <div className="col-md-2 text-center">
                                <small className="text-muted d-block">Unit Price</small>
                                <strong>₹{basePrice?.toFixed(2)}</strong>
                              </div>
                              <div className="col-md-2">
                                <div className="input-group">
                                  <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    onClick={() =>
                                      handleQuantityChange(item.productId, item.quantity - 1)
                                    }
                                  >
                                    -
                                  </button>
                                  <input
                                    type="text"
                                    className="form-control text-center"
                                    value={item.quantity}
                                    onChange={(e) =>
                                      handleQuantityChange(item.productId, e.target.value)
                                    }
                                  />
                                  <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    onClick={() =>
                                      handleQuantityChange(item.productId, item.quantity + 1)
                                    }
                                  >
                                    +
                                  </button>
                                </div>
                                <small className="text-muted d-block text-center mt-1">
                                  Stock: {product.stock}
                                </small>
                              </div>
                              <div className="col-md-1 text-center">
                                <DeleteIcon
                                  fontSize="small"
                                  style={{ cursor: 'pointer', color: '#dc3545' }}
                                  onClick={() => handleRemoveItem(item.productId)}
                                />
                              </div>
                            </div>
                            <div className="row mt-2">
                              <div className="col-12 text-end">
                                <small className="text-muted">Total: </small>
                                <strong>₹{itemTotal.toFixed(2)}</strong>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="col-md-4">
                    <div className="card shadow-sm">
                      <div className="card-body">
                        <h5 className="card-title mb-4">Order Summary</h5>
                        <div className="d-flex justify-content-between mb-2">
                          <span className="text-muted">Total Items</span>
                          <strong>{totals.totalItems}</strong>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span className="text-muted">Subtotal</span>
                          <strong>₹{totals.subtotal.toFixed(2)}</strong>
                        </div>
                        <hr />
                        <div className="d-flex justify-content-between mb-3">
                          <h6 className="mb-0">Grand Total</h6>
                          <h6 className="mb-0">₹{totals.total.toFixed(2)}</h6>
                        </div>
                        <CButton color="primary" onClick={UpdateCart} className="w-100">
                          Proceed to Checkout
                        </CButton>
                        <CButton color="light" className="w-100 mt-2">
                          Continue Shopping
                        </CButton>
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

export default CreateOrder
