import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import { useNavigate, useLocation, useResolvedPath } from 'react-router-dom'

const Dashboard = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const resolvePath = useResolvedPath('')
  const isParentScreen = location.pathname === resolvePath.pathname
  return (
    <div
      className={['screen pb-9', !isParentScreen ? 'hidden-screen' : ''].join(
        ' ',
      )}
    >
      <Toolbar
        items={[
          <ToolbarButton
            key={'negative'}
            icon={<ChevronLeftIcon className="w-6" />}
            onClick={() => navigate(-1)}
          />,
          <ToolbarTitle key="title" title="Dashboard" />,
          null,
        ]}
      />
      Dashboard
    </div>
  )
}

export default Dashboard
