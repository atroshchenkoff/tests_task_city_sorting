import cn from 'classnames'
import './fadedTitle.sass'

const FadedTitle = ({ show: collapsed }: { show: boolean }) => {
  return (
    <div className={cn('wrapper', collapsed ? 'collapsed' : 'show')}>
      {!collapsed && 'My Dashboard'}
    </div>
  )
}

export default FadedTitle
