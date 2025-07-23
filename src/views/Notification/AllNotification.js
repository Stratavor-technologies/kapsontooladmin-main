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

const AllNotification = () => {
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
    validTill: '',
    heading: '',
    message: '',
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
    if (!newNotification.heading || !newNotification.message || !newNotification.validTill) {
      alert('Please fill in all required fields.')
      return
    }

    const newId = Math.max(...notifications.map((n) => n.id), 0) + 1
    const formattedNotification = {
      id: newId,
      title: newNotification.heading || 'New Notification',
      message: newNotification.message || '',
      date: new Date().toISOString().split('T')[0],
      isOpen: false,
      sentTo: newNotification.distributor || 'All',
      detailsOpen: false,
    }

    setNotifications([...notifications, formattedNotification])
    setNewNotification({
      distributor: '',
      dealer: '',
      validTill: '',
      heading: '',
      message: '',
    })
    setShowModal(false)
  }
  return (
    <CContainer fluid className="min-vh-100">
      <CRow>
        <CCol>
          <h1 className="mt-4 mb-3">Notifications</h1>
          <CRow className="justify-content-end mb-3">
            <CCol xs="auto">
              <CButton color="primary" className="" onClick={() => setShowModal(true)}>
                <CIcon icon={cilBell} className="me-1" />
                Add Notification
              </CButton>
            </CCol>
          </CRow>

          {notifications.map((notification) => (
            <CCard key={notification.id} className="mb-3 border-0 notification-card">
              <CCardHeader
                className="border  d-flex justify-content-between align-items-center"
                style={{ cursor: 'pointer' }}
                onClick={() => toggleNotification(notification.id)}
              >
                <div>{notification.title}</div>
                <div>Date: {notification.date}</div>
              </CCardHeader>

              <CCollapse visible={notification.isOpen}>
                <CCardBody className="border border-secondary border-top-0">
                  <div>{notification.message || 'No message content'}</div>

                  <div className="mt-3">
                    <CButton
                      color="primary"
                      // variant="outline"
                      size="sm"
                      className=" border-secondary"
                      onClick={(e) => toggleSentToDetails(notification.id, e)}
                    >
                      Sent To {notification.sentTo}{' '}
                      <span className="ms-1">{notification.detailsOpen ? '-' : '+'}</span>
                    </CButton>
                  </div>

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

      <CModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        backdrop="static"
        alignment="center"
        className=""
        dark
      >
        <CModalHeader className="border-bottom border-secondary">
          <h5>Add Notification</h5>
          {/* <CCloseButton className="" onClick={() => setShowModal(false)} /> */}
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow>
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel className="text-secondary">Distributor</CFormLabel>
                  <CFormSelect
                    name="distributor"
                    value={newNotification.distributor}
                    onChange={handleInputChange}
                    className="border-secondary"
                  >
                    <option value="">Select Distributor</option>
                    <option value="All">All</option>
                    <option value="Distributor1">Distributor 1</option>
                    <option value="Distributor2">Distributor 2</option>
                    <option value="Distributor3">Distributor 3</option>
                  </CFormSelect>
                </div>
              </CCol>
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel className="text-secondary">Dealer</CFormLabel>
                  <CFormSelect
                    name="dealer"
                    value={newNotification.dealer}
                    onChange={handleInputChange}
                    className="border-secondary"
                  >
                    <option value="">Select Dealer</option>
                    <option value="All">All</option>
                    <option value="Dealer1">Dealer 1</option>
                    <option value="Dealer2">Dealer 2</option>
                    <option value="Dealer3">Dealer 3</option>
                  </CFormSelect>
                </div>
              </CCol>
            </CRow>
            <CRow>
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel className="text-secondary">Valid Till *</CFormLabel>
                  <CFormInput
                    type="date"
                    name="validTill"
                    value={newNotification.validTill}
                    onChange={handleInputChange}
                    className="border-secondary"
                    required
                  />
                </div>
              </CCol>
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel className="text-secondary">Notification Heading</CFormLabel>
                  <CFormInput
                    name="heading"
                    value={newNotification.heading}
                    onChange={handleInputChange}
                    className="border-secondary"
                  />
                </div>
              </CCol>
            </CRow>
            <div className="mb-3">
              <CFormLabel className="text-secondary">Notification</CFormLabel>
              <CFormTextarea
                name="message"
                value={newNotification.message}
                onChange={handleInputChange}
                className="border-secondary"
                rows={4}
              />
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter className="border-0 justify-content-end">
          <CButton color="primary" onClick={handleSubmit} className="px-4">
            Submit
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  )
}

export default AllNotification
