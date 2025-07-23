import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))
const Login = React.lazy(() => import('./views/pages/login/Login'))
const ForgotPassword = React.lazy(() => import('./views/pages/login/ForgotPassword'))
const VerifyOTP = React.lazy(() => import('./views/pages/login/VerifyOTP'))
const ResetPassword = React.lazy(() => import('./views/pages/login/ResetPassword'))

// Base
const AllProducts = React.lazy(() => import('./views/base/Products/AllProducts'))
const SubCategoryProducts = React.lazy(() => import('./views/base/Products/SubCategoryProducts'))
const ProductHsn = React.lazy(() => import('./views/base/Products/ProductHsn'))
const AddProduct = React.lazy(() => import('./components/AddProduct'))
const ViewProduct = React.lazy(() => import('./components/ViewProduct'))
const EditProduct = React.lazy(() => import('./components/EditProduct'))
const ProductsCategories = React.lazy(() => import('./views/base/Products/ProductsCategories'))

// Orders
const AllOrders = React.lazy(() => import('./views/Orders/AllOrders'))
const OtherOrders = React.lazy(() => import('./views/Orders/OtherOrders'))
const ViewOrder = React.lazy(() => import('./components/ViewOrder'))
const ViewOtheroders = React.lazy(() => import('./components/ViewOtherorder'))
const OrderDispatch = React.lazy(() => import('./views/Orders/OrderDispatch'))
const ViewDipatch = React.lazy(() => import('./components/ViewDispatch'))
const Dispatch = React.lazy(() => import('./views/Orders/Dispatch'))
const CreateOrder = React.lazy(() => import('./views/Orders/CreateOrder'))
const PlaceOrder = React.lazy(() => import('./views/Orders/PlaceOrder'))

const DealersDistributors = React.lazy(
  () => import('./views/Dealers/DealersDistributors/DealersDistributors'),
)
const AddDealerDistributor = React.lazy(() => import('./components/AddDealerDistributor'))
const DealerShipView = React.lazy(() => import('./components/DealerShipView'))
const DealerShipEdit = React.lazy(() => import('./views/Dealers/EditDealership'))
const ViewDealerDistributor = React.lazy(() => import('./views/Dealers/DealersDistributors/ViewDealerDistributor'))

const MyDispatch = React.lazy(() => import('./views/Orders/MyDispatch'))
//payments
const PendingPayments = React.lazy(() => import('./views/Payment/PendingPayment'))
const ReceivePayment = React.lazy(() => import('./views/Payment/ReceivePayment'))
const ReceivedPaymentHistory = React.lazy(() => import('./views/Payment/ReceivedPaymentHistory'))
const PaymentHistory = React.lazy(() => import('./views/Payment/PaymentHistory'))
const MyPayment = React.lazy(() => import('./views/Payment/Mypayment'))

// Profile
const Profile = React.lazy(() => import('./views/Profile/Profile'))

// Banners
const Banner = React.lazy(() => import('./views/Banners/Banner'))

// Notifications
const AllNotification = React.lazy(() => import('./views/Notification/AllNotification'))
const Badge = React.lazy(() => import('./views/Notification/Badge'))
const DelarRquestes = React.lazy(() => import('./views/Notification/DelarRquestes'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/login', name: 'Login', element: Login },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/theme', name: 'Theme', element: Colors, exact: true },
  { path: '/theme/colors', name: 'Colors', element: Colors },
  { path: '/theme/typography', name: 'Typography', element: Typography },
  { path: '/Products/AllProducts', name: 'AllProducts', element: AllProducts },
  { path: '/Products/AllProducts/AddProduct', name: 'AddProduct', element: AddProduct },
  { path: '/Products/AllProducts/ViewProduct/:id', name: 'ViewProduct', element: ViewProduct },
  { path: '/Products/AllProducts/EditProduct/:id', name: 'EditProduct', element: EditProduct },
  { path: '/Products/ProductsCategories', name: 'ProductsCategories', element: ProductsCategories },
  { path: '/Products/ProductHsn', name: 'ProductHsn', element: ProductHsn },
  {
    path: '/Products/SubCategoryProducts',
    name: 'SubCategoryProducts',
    element: SubCategoryProducts,
  },
  { path: '/Payments/ReceivePayment/:id', name: 'ReceivePayment', element: ReceivePayment },
  { path: '/Payments/PendingPayments', name: 'PendingPayments', element: PendingPayments },
  { path: '/Orders', name: 'AllOrders', element: AllOrders },
  { path: '/Orders/OtherOrders', name: 'OtherOrders', element: OtherOrders },
  { path: '/Orders/ViewOrder/:id', name: 'ViewOrder', element: ViewOrder },
  { path: '/Orders/ViewOtheroders/:id', name: 'ViewOtheroders', element: ViewOtheroders },
  { path: '/Orders/OrderDispatch/:id', name: 'OrderDispatch', element: OrderDispatch },
  { path: '/PlaceOrder/:orderId', name: 'PlaceOrder', element: PlaceOrder },
  { path: '/Dispatch', name: 'Dispatch', element: Dispatch },
  { path: '/Dispatch/ViewDispatch/:id', name: 'ViewDispatch', element: ViewDipatch },
  { path: '/Dispatch/MyDispatch', name: 'MyDispatch', element: MyDispatch },
  { path: '/DealersDistributors', name: 'DealersDistributors', element: DealersDistributors },
  {
    path: '/DealersDistributors/AddDealerDistributor',
    name: 'AddDealerDistributor',
    element: AddDealerDistributor,
  },
  { path: '/CreateOrder', name: 'CreateOrder', element: CreateOrder },
  {
    path: '/Payments/PaymentHistory/ReceivedPaymentHistory',
    name: 'ReceivedPaymentHistory',
    element: ReceivedPaymentHistory,
  },
  { path: '/Payments/PaymentHistory', name: 'PaymentHistory', element: PaymentHistory },
  { path: '/Payments/OwnPaymentsStatus', name: 'OwnPaymentsStatus', element: MyPayment },
  { path: '/Notifications/AllNotification', name: 'AllNotification', element: AllNotification },
  { path: '/Banners', name: 'Banner', element: Banner },
  { path: '/Notifications/Badge', name: 'Badge', element: Badge },
  { path: '/Notifications/DelarRquestes', name: 'DelarRquestes', element: DelarRquestes },
  {
    path: '/DealersDistributors/DealerShipView',
    name: 'DealerShipView',
    element: DealerShipView,
  },
  {
    path: '/DealersDistributors/DealerShipView/:id',
    name: 'ViewDealerDistributor',
    element: ViewDealerDistributor,
  },
  {
    path: '/DealersDistributors/DealerShipEdit/:id',
    name: 'DealerShipEdit',
    element: DealerShipEdit,
  },
  { path: '/profile', name: 'Profile', element: Profile },
]

export default routes
