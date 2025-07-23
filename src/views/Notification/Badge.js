import React, { useState } from 'react'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
  CRow,
  CCol,
  CContainer,
  CBreadcrumb,
  CBreadcrumbItem,
  CCollapse,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CForm,
  CFormLabel,
  CFormInput,
  CFormTextarea,
  CCloseButton,
  CFormSelect,
} from '@coreui/react'
import { cilTrash, cilBell, cilHome } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const Badge = () => {
  // Sample notifications data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'DISCCOUNT',
      message: 'testing',
      date: '2024-12-03',
      isOpen: false,
      sentTo: 'All',
      detailsOpen: false,
    },
    {
      id: 2,
      title: '00',
      message: '',
      date: '2025-03-12',
      isOpen: false,
      sentTo: 'Admins',
      detailsOpen: false,
    },
  ])

  const [showModal, setShowModal] = useState(false)
  const [newNotification, setNewNotification] = useState({
    distributor: '',
    dealer: '',
    offerStartsOn: '',
    offerEndsOn: '',
    heading: '',
    details: '',
  })

  // Toggle notification open/close
  const toggleNotification = (id) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, isOpen: !notification.isOpen } : notification,
      ),
    )
  }

  // Toggle sent to details open/close
  const toggleSentToDetails = (id, event) => {
    event.stopPropagation()
    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? { ...notification, detailsOpen: !notification.detailsOpen }
          : notification,
      ),
    )
  }

  // Delete notification
  const deleteNotification = (id, event) => {
    event.stopPropagation()
    setNotifications(notifications.filter((notification) => notification.id !== id))
  }

  // Handle input changes for new notification
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewNotification({
      ...newNotification,
      [name]: value,
    })
  }

  // Handle form submission
  const handleSubmit = () => {
    if (!newNotification.heading || !newNotification.details || !newNotification.offerEndsOn) {
      alert('Please fill in all required fields.')
      return
    }

    const newId = Math.max(...notifications.map((n) => n.id), 0) + 1
    const formattedNotification = {
      id: newId,
      title: newNotification.heading || 'New Notification',
      message: newNotification.details || '',
      date: newNotification.offerStartsOn || new Date().toISOString().split('T')[0],
      isOpen: false,
      sentTo: newNotification.distributor || 'All',
      detailsOpen: false,
    }

    setNotifications([...notifications, formattedNotification])
    setNewNotification({
      distributor: '',
      dealer: '',
      offerStartsOn: '',
      offerEndsOn: '',
      heading: '',
      details: '',
    })
    setShowModal(false)
  }

  return (
    <CContainer fluid className="min-vh-100">
      <CRow>
        <CCol>
          <h1 className="mt-4 mb-3">Offers</h1>
          <CRow className="justify-content-end mb-3">
            <CCol xs="auto">
              <CButton color="primary" className="" onClick={() => setShowModal(true)}>
                <CIcon icon={cilBell} className="me-1" />
                Add Offers
              </CButton>
            </CCol>
          </CRow>

          {notifications.map((notification) => (
            <CCard key={notification.id} className="mb-3 border-0 notification-card">
              <CCardHeader
                className="border d-flex justify-content-between align-items-center"
                style={{ cursor: 'pointer' }}
                onClick={() => toggleNotification(notification.id)}
              >
                <div>{notification.title}</div>
                <div>Date: {notification.date}</div>
              </CCardHeader>

              <CCollapse visible={notification.isOpen}>
                <CCardBody className="border border-secondary border-top-0">
                  <div>{notification.message || 'No message content'}</div>

                  {/* <div className="mt-3">
                    <CButton
                      color="primary"
                      size="sm"
                      className="border-secondary"
                      onClick={(e) => toggleSentToDetails(notification.id, e)}
                    >
                      Sent To {notification.sentTo}{' '}
                      <span className="ms-1">{notification.detailsOpen ? '-' : '+'}</span>
                    </CButton>
                  </div> */}

                  <CCollapse visible={notification.detailsOpen}>
                    <div className="mt-3 border border-secondary p-3">
                      <p>Recipients: {notification.sentTo}</p>
                      <p>Priority: Medium</p>
                      <p>Status: Unread</p>
                      <p>Delivery Time: {notification.date} 10:30 AM</p>
                      <p>Read By: 45 users</p>
                    </div>
                  </CCollapse>

                  <div className="d-flex justify-content-end mt-3">
                    <CButton
                      color="primary"
                      size="sm"
                      className="border-secondary"
                      onClick={(e) => deleteNotification(notification.id, e)}
                    >
                      <CIcon icon={cilTrash} /> Delete?
                    </CButton>
                  </div>
                </CCardBody>
              </CCollapse>
            </CCard>
          ))}
        </CCol>
      </CRow>

      {/* Add Notification Modal */}
      <CModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        backdrop="static"
        alignment="center"
        className="modal-dark"
        dark
      >
        <CModalHeader className="border-bottom-0 pb-0 position-relative">
          <h5 className=" w-100 text-center">Add Offers</h5>
          <span
            className="position-absolute"
            style={{ right: '15px', top: '10px', cursor: 'pointer' }}
            onClick={() => setShowModal(false)}
          ></span>
        </CModalHeader>
        <CModalBody className="pt-3">
          <CForm>
            <div className="mb-3">
              <CFormSelect
                name="distributor"
                value={newNotification.distributor}
                onChange={handleInputChange}
                className=""
                style={{
                  borderBottom: '1px solid #FF5000 !important',
                  borderRadius: '0',
                }}
              >
                <option value="">Select Group</option>
                <option value="All">All</option>
                <option value="Distributor1">Distributor 1</option>
                <option value="Distributor2">Distributor 2</option>
              </CFormSelect>
            </div>

            <div className="mb-3">
              <label>Offer Starts On</label>
              <CFormInput
                type="date"
                name="offerStartsOn"
                value={newNotification.offerStartsOn}
                onChange={handleInputChange}
                style={{
                  borderBottom: '1px solid #FF5000 !important',
                  borderRadius: '0',
                }}
                placeholder="Offer Starts On *"
                required
              />
            </div>

            <div className="mb-3">
              <label>Offer End On</label>
              <CFormInput
                type="date"
                name="offerEndsOn"
                value={newNotification.offerEndsOn}
                onChange={handleInputChange}
                style={{
                  borderBottom: '1px solid #FF5000 !important',
                  borderRadius: '0',
                }}
                placeholder="Offer Ends On *"
                required
              />
            </div>

            <div className="mb-3">
              <CFormInput
                name="heading"
                value={newNotification.heading}
                onChange={handleInputChange}
                className="border border-bottom "
                style={{
                  borderBottom: '1px solid #FF5000 !important',
                  borderRadius: '0',
                }}
                placeholder="Offer Heading"
              />
            </div>

            <div className="mb-3">
              <CFormTextarea
                name="details"
                value={newNotification.details}
                onChange={handleInputChange}
                className="border"
                style={{
                  borderBottom: '1px solid #FF5000 !important',
                  borderRadius: '0',
                  minHeight: '100px',
                }}
                placeholder="Offer Details"
                rows={4}
              />
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter className="border-0 justify-content-center">
          <CButton
            color="primary"
            onClick={handleSubmit}
            className="px-4"
            style={{
              border: 'none',
              borderRadius: '4px',
              padding: '8px 32px',
            }}
          >
            Submit
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  )
}

export default Badge
