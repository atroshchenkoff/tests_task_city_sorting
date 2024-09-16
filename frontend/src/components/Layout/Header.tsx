import { Layout, Avatar, Dropdown, Typography, MenuProps } from 'antd'
import {
  UserOutlined,
  LogoutOutlined,
  LoadingOutlined,
} from '@ant-design/icons'
import './header.sass'

const { Header } = Layout
const { Text } = Typography

const AppHeader = ({
  sendToAuthMachine,
  sendToAdminMachine,
  locations,
  selectedLocation,
  email,
  isOrganizer,
  availableVenueTitle,
}) => {
  const items: MenuProps['items'] = [
    {
      key: '0',
      type: 'group',
      label: email,
      children: [],
    },
    {
      type: 'divider',
    },
    {
      key: '1',
      type: 'group',
      label: 'Locations',
      children: locations.map((item: string) => ({
        key: item,
        label: item,
      })),
    },
    {
      type: 'divider',
    },
    {
      key: '2',
      icon: <LogoutOutlined />,
      label: <span onClick={() => sendToAuthMachine('SIGN_OUT')}>Log Out</span>,
    },
  ]

  return (
    <Header>
      <Dropdown
        arrow
        trigger={['click']}
        menu={{
          items,
          selectable: true,
          defaultSelectedKeys: [selectedLocation],
          onSelect: ({ key }) =>
            sendToAdminMachine({ type: 'CHANGE_LOCATION', payload: key }),
        }}
      >
        <Avatar
          shape="circle"
          className="userAvatar"
          icon={email ? <UserOutlined /> : <LoadingOutlined />}
        />
      </Dropdown>
      <Text type="secondary" className="text">
        {selectedLocation ? (
          isOrganizer ? (
            `${selectedLocation} • ${availableVenueTitle}`
          ) : (
            selectedLocation
          )
        ) : (
          <LoadingOutlined />
        )}
      </Text>
    </Header>
  )
}

export default AppHeader
