import { lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

const CityListPage = lazy(() => import('../../pages/CityListPage/CityListPage'))
const NamedListPage = lazy(() => import('../../pages/NamedListPage/NamedListPage'))

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/">
        <Route index element={<Navigate to="city-list" replace={true} />} />

        <Route path="city-list" element={<CityListPage />} />
        <Route path="named-list" element={<NamedListPage />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
