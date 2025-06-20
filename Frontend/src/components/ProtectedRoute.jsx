import { Navigate, useLocation } from 'react-router-dom'
import { useAppState } from '../contexts/AppStateContext'

const ProtectedRoute = ({ children }) => {
    const { authLoading, authUser } = useAppState()
    const location = useLocation()

    // Show loading while checking auth state
    if (authLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading...</p>
                </div>
            </div>
        )
    }

    // If not authenticated, redirect to login with the current location
    if (!authUser) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    // If authenticated, render the protected content
    return children
}

export default ProtectedRoute
