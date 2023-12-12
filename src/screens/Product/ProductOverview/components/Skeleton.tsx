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
      <div className="flex w-full flex-row items-center justify-between">
        <div className="skeleton h-[24px] w-[69px] rounded-md" />
        <div className="skeleton h-[24px] w-[53px] rounded-md" />
      </div>
      <div className="flex w-full flex-col items-center justify-start gap-4 overflow-x-auto ">
        <div className={`relative h-full w-full`}>
          <div className={`flex flex-row flex-wrap gap-3`}>
            {Array.from({ length: skeletonNumber }).map((_, index) => (
              <div
                key={index}
                className="skeleton h-[213px] w-[155px] rounded-md"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
export default Skeleton
