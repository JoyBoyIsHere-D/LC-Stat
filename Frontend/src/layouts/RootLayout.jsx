import { Outlet } from 'react-router-dom'
import Navigation from '../components/Navigation'

const RootLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navigation />
      <Outlet />
    </div>
  )
}

export default RootLayout
