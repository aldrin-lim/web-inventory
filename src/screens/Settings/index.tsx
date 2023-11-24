import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import { useNavigate } from 'react-router-dom'
import { AppPath } from 'routes/AppRoutes.types'

const Settings = () => {
  const navigate = useNavigate()
  return (
    <div className="section flex flex-col gap-4">
      <Toolbar
        items={[
          <div key={0} />,
          <ToolbarTitle key="title" title="Settings" />,
          <div key={1} />,
        ]}
      />
    </div>
  )
}

export default Settings
