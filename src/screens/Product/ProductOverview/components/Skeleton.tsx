import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import useMediaQuery, { ScreenSize } from 'hooks/useMediaQuery'
import { useNavigate } from 'react-router-dom'
import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import { AppPath } from 'routes/AppRoutes.types'

const getSkeletonNumber = (size: ScreenSize) => {
  switch (size) {
    case 'xs':
    case 'sm':
      return 4
    case 'md':
    case 'lg':
      return 8
    default:
      return 10
  }
}

const Skeleton = () => {
  const navigate = useNavigate()
  const { currentBreakpoint } = useMediaQuery({ updateOnResize: true })

  const skeletonNumber = getSkeletonNumber(currentBreakpoint)
  return (
    <div className="ProductOverview section">
      <Toolbar
        items={[
          <ToolbarButton
            key={'back'}
            icon={<ChevronLeftIcon className="w-6" />}
            onClick={() => navigate(AppPath.Products)}
          />,

          <ToolbarTitle key="title" title="Products" />,
          <div key={null} />,
        ]}
      />
      <div className="ProductMenuGrid grid w-full grid-flow-row-dense grid-cols-2 justify-center gap-4 md:flex md:flex-row md:flex-wrap">
        <div className="skeleton block min-h-[221px] min-w-[155px] max-w-[155px] justify-self-center" />
        <div className="skeleton block min-h-[221px] min-w-[155px] max-w-[155px] justify-self-center" />
        <div className="skeleton block min-h-[221px] min-w-[155px] max-w-[155px] justify-self-center" />
        <div className="skeleton block min-h-[221px] min-w-[155px] max-w-[155px] justify-self-center" />

        {/* MORE ON LARGER VIEW */}

        <div className="skeleton hidden min-h-[221px] min-w-[155px] max-w-[155px] justify-self-center md:block" />
        <div className="skeleton hidden min-h-[221px] min-w-[155px] max-w-[155px] justify-self-center md:block" />
        <div className="skeleton hidden min-h-[221px] min-w-[155px] max-w-[155px] justify-self-center md:block" />
        <div className="skeleton hidden min-h-[221px] min-w-[155px] max-w-[155px] justify-self-center md:block" />
      </div>
    </div>
  )
}
export default Skeleton
