import { Suspense, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Layout, Menu, MenuProps, Spin } from 'antd'
import {
  UnorderedListOutlined,
  GlobalOutlined
} from '@ant-design/icons'
import './index.sass'
// import AppHeader from './Header'
import AppRoutes from './Routes'
import FadedTitle from './FadedTitle'

const { Footer, Sider, Content } = Layout

const ContentFallbackSpinner = () => (
  <div
    style={{
      display: 'grid',
      alignItems: 'center',
      justifyItems: 'center',
      height: '100%',
    }}
  >
    <Spin size="large" />
  </div>
)

const Dashboard = () => {
  const [isCollapsedMenu, setIsCollapsedMenu] = useState<boolean>(false)

  const menuItems: MenuProps['items'] = [
    {
      key: 'city-list',
      label: (
        <Link to="city-list">
          <GlobalOutlined />
          <span>Доступные города</span>
        </Link>
      ),
    },
    {
      key: 'named-list',
      label: (
        <Link to="named-list">
          <UnorderedListOutlined />
          <span>Списки городов</span>
        </Link>
      ),
    }
  ]

  const location = useLocation()
  const calculateCurrentMenuKey = (): string[] => {
    const defaultPage = 'city-list'
    const currentUrl = location.pathname
    const isHomeUrl = currentUrl === '/'
    const urlReplacedToMenuItemsKey = currentUrl.replace('/', '')
    return isHomeUrl ? [defaultPage] : [urlReplacedToMenuItemsKey]
  }

  return (
    <Layout className="layout">
      <Sider
        breakpoint="xl"
        collapsible
        collapsed={isCollapsedMenu}
        onCollapse={() => {
          setIsCollapsedMenu(!isCollapsedMenu)
        }}
      >
        <div className="menuHeader">
          <div className="logo">
            <FadedTitle show={isCollapsedMenu} />
          </div>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={calculateCurrentMenuKey()}
          items={menuItems}
        />
      </Sider>

      <Layout>
        {/* <AppHeader
          sendToAuthMachine={send}
          sendToAdminMachine={sendToAdminMachine}
          locations={locations}
          selectedLocation={selectedLocation}
          email={email}
          isOrganizer={isOrganizer}
          availableVenueTitle={availableVenueTitle}
        /> */}
        <Content className="contentPadding">
          <Suspense fallback={<ContentFallbackSpinner />}>
            <AppRoutes />
          </Suspense>
        </Content>
        <Footer className="footer">City Sorter</Footer>
      </Layout>
    </Layout>
  )
}

export default Dashboard
