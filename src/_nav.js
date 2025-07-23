import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilExternalLink,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore'

// Export a function that takes userRole as a parameter instead of accessing localStorage directly
const getNavigation = (userRole) => {
  return [
    {
      component: CNavItem,
      name: 'Dashboard',
      to: '/dashboard',
      icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      // badge: {
      //   color: 'info',
      //   text: 'NEW',
      // },
    },
    // Products menu - only shown for ADMIN role
    {
      component: CNavGroup,
      name: 'Products',
      to: '/base',
      icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'All Products',
          to: '/Products/AllProducts',
        },
        {
          component: CNavItem,
          name: 'Products Categories',
          to: '/Products/ProductsCategories',
        },
        {
          component: CNavItem,
          name: 'Product Sub Categories',
          to: '/Products/SubCategoryProducts',
        },
        {
          component: CNavItem,
          name: 'Product HSN',
          to: '/Products/ProductHsn',
        },
      ],
    },
    {
      component: CNavGroup,
      name: 'Orders',
      to: '/Orders',
      icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'All Orders',
          to: '/Orders',
        },
        ...(userRole !== 'DEALER' ? [{
          component: CNavItem,
          name: 'Dispatch',
          to: '/Dispatch',
        }] : []),
        ...(userRole === 'DEALER' ? [{
          component: CNavItem,
          name: 'Dispatch',
          to: '/Dispatch/MyDispatch',
        }] : []),
      ],
    },

    ...(userRole === 'ADMIN' || userRole === 'DISTRIBUTER' ? [{
      component: CNavItem,
      name: userRole === 'ADMIN' ? 'Dealers / Distributors' : 'Dealers',
      to: '/DealersDistributors',
      icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
    }] : []),
    {
      component: CNavGroup,
      name: 'Payments',
      icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
      items: [
        ...(userRole !== 'DEALER' ? [
          {
            component: CNavItem,
            name: 'Pending Payments',
            to: '/Payments/PendingPayments',
          },
          {
            component: CNavItem,
            name: 'Payments History',
            to: '/Payments/PaymentHistory',
          },
        ] : []),
        ...(userRole === 'DISTRIBUTER' ? [
          {
            component: CNavItem,
            name: 'Own Payments Status',
            to: '/Payments/OwnPaymentsStatus',
          },
        ] : []),
        ...(userRole === 'DEALER' ? [
          {
            component: CNavItem,
            name: 'Paid Payments',
            to: '/Payments/PaymentHistory/ReceivedPaymentHistory',
          },
        ] : []),
      ],
    },
    ...(userRole == 'ADMIN' ? [
      {
        component: CNavItem,
        name: 'Banners',
        to: '/Banners',
        icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
        // badge: {
        //   color: 'info',
        //   text: 'NEW',
        // },
      },
    ] : []),
    ...(userRole !== 'ADMIN' ? [
      // This will be included when userRole is NOT 'ADMIN'
      {
        component: CNavItem,
        name: 'Create Order',
        to: '/CreateOrder',
        icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
      }
    ] : [
      // This empty array will be used when userRole IS 'ADMIN'
    ]),
  ]
}

export default getNavigation