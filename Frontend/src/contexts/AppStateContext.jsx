import { createContext, useContext, useReducer, useEffect } from 'react'
import { auth } from '../config/firebase'
import { getUserByUid, fetchFriendsStats } from '../config/userService'

// Create contexts
const AppStateContext = createContext()
const AppDispatchContext = createContext()

// Action types
const ACTIONS = {
  SET_AUTH_LOADING: 'SET_AUTH_LOADING',
  SET_AUTH_USER: 'SET_AUTH_USER',
  SET_USER_DATA: 'SET_USER_DATA',
  SET_DASHBOARD_DATA: 'SET_DASHBOARD_DATA',
  SET_DASHBOARD_LOADING: 'SET_DASHBOARD_LOADING',
  SET_DASHBOARD_ERROR: 'SET_DASHBOARD_ERROR',
  CLEAR_DASHBOARD_DATA: 'CLEAR_DASHBOARD_DATA'
}

// Initial state
const initialState = {
  // Auth state
  authLoading: true,
  authUser: null,
  userData: null,
  
  // Dashboard state
  dashboardData: null,
  dashboardLoading: false,
  dashboardError: null,
  lastFetchTime: null,
  
  // Cache settings
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
}

// Reducer
function appReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_AUTH_LOADING:
      return { ...state, authLoading: action.payload }
    
    case ACTIONS.SET_AUTH_USER:
      return { ...state, authUser: action.payload }
    
    case ACTIONS.SET_USER_DATA:
      return { ...state, userData: action.payload }
    
    case ACTIONS.SET_DASHBOARD_DATA:
      return { 
        ...state, 
        dashboardData: action.payload,
        lastFetchTime: Date.now(),
        dashboardError: null
      }
    
    case ACTIONS.SET_DASHBOARD_LOADING:
      return { ...state, dashboardLoading: action.payload }
    
    case ACTIONS.SET_DASHBOARD_ERROR:
      return { ...state, dashboardError: action.payload, dashboardLoading: false }
    
    case ACTIONS.CLEAR_DASHBOARD_DATA:
      return { 
        ...state, 
        dashboardData: null, 
        lastFetchTime: null, 
        dashboardError: null 
      }
    
    default:
      return state
  }
}

// Provider component
export function AppStateProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Handle auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      dispatch({ type: ACTIONS.SET_AUTH_USER, payload: currentUser })
      dispatch({ type: ACTIONS.SET_AUTH_LOADING, payload: false })

      if (currentUser) {
        try {
          const userData = await getUserByUid(currentUser.uid)
          dispatch({ type: ACTIONS.SET_USER_DATA, payload: userData })
        } catch (err) {
          console.error('Error fetching user data:', err)
        }
      } else {
        dispatch({ type: ACTIONS.SET_USER_DATA, payload: null })
        dispatch({ type: ACTIONS.CLEAR_DASHBOARD_DATA })
      }
    })

    return () => unsubscribe()
  }, [])

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  )
}

// Custom hooks
export function useAppState() {
  const context = useContext(AppStateContext)
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider')
  }
  return context
}

export function useAppDispatch() {
  const context = useContext(AppDispatchContext)
  if (!context) {
    throw new Error('useAppDispatch must be used within AppStateProvider')
  }
  return context
}

// Helper hook for dashboard data with caching
export function useDashboardData() {
  const state = useAppState()
  const dispatch = useAppDispatch()

  const fetchDashboardData = async (forceRefresh = false) => {
    const { userData, dashboardData, lastFetchTime, CACHE_DURATION } = state

    // Check if we have cached data and it's still fresh
    if (!forceRefresh && dashboardData && lastFetchTime) {
      const timeSinceLastFetch = Date.now() - lastFetchTime
      if (timeSinceLastFetch < CACHE_DURATION) {
        console.log('Using cached dashboard data')
        return dashboardData
      }
    }

    if (!userData?.id) {
      console.log('No user data available for dashboard')
      return null
    }

    try {
      dispatch({ type: ACTIONS.SET_DASHBOARD_LOADING, payload: true })
      console.log('Fetching fresh dashboard data...')
      
      const data = await fetchFriendsStats(userData.id)
      
      dispatch({ type: ACTIONS.SET_DASHBOARD_DATA, payload: data })
      dispatch({ type: ACTIONS.SET_DASHBOARD_LOADING, payload: false })
      
      return data
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      dispatch({ type: ACTIONS.SET_DASHBOARD_ERROR, payload: error.message })
      throw error
    }
  }

  const refreshDashboardData = () => fetchDashboardData(true)

  return {
    dashboardData: state.dashboardData,
    dashboardLoading: state.dashboardLoading,
    dashboardError: state.dashboardError,
    fetchDashboardData,
    refreshDashboardData,
    isCacheValid: state.lastFetchTime && (Date.now() - state.lastFetchTime < state.CACHE_DURATION)
  }
}

export { ACTIONS }
