import { useRoutes } from 'react-router-dom'
import UserDetail from './components/UserDetail'
export default function useRouteElements() {
  const routes = useRoutes([
    { path: '/userDetail', element: <UserDetail /> }
  ])
  return routes
}