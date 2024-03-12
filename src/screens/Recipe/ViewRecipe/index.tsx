import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import useGetRecipe from 'hooks/useGetRecipe'
import { useParams } from 'react-router-dom'
import RecipeDetails from '../RecipeDetails'
import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import mixpanel from 'mixpanel-browser'
import { useEffect } from 'react'

const Skeleton = () => {
  return (
    <div className="screen">
      <Toolbar
        items={[
          <ToolbarButton
            key={1}
            icon={<ChevronLeftIcon className="w-6" />}
            onClick={() => {}}
          />,

          <ToolbarTitle key="title" title="View Product" />,
          <ToolbarButton key="save" label="Save" disabled />,
        ]}
      />

      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-4">
          <div className="skeleton h-[104px] w-[351px] rounded-md" />
        </div>
        <div className="skeleton h-[48px] w-full rounded-md" />
        <div className="skeleton h-[48px] w-full rounded-md" />
        <div className="skeleton h-[48px] w-full rounded-md" />
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-4 overflow-x-auto sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          <div className="skeleton block min-h-[221px] min-w-[155px] max-w-[155px] justify-self-center" />
          <div className="skeleton block min-h-[221px] min-w-[155px] max-w-[155px] justify-self-center" />
          <div className="skeleton block min-h-[221px] min-w-[155px] max-w-[155px] justify-self-center" />
          <div className="skeleton block min-h-[221px] min-w-[155px] max-w-[155px] justify-self-center" />
          <div className="skeleton hidden min-h-[221px] min-w-[155px] max-w-[155px] justify-self-center lg:block" />
          <div className="skeleton hidden min-h-[221px] min-w-[155px] max-w-[155px] justify-self-center lg:block" />
        </div>
      </div>
    </div>
  )
}

const ViewRecipe = () => {
  const { id } = useParams<{ id: string }>()

  useEffect(() => {
    mixpanel.track_pageview({ page: 'Edit Recipe' })
  }, [])
  const { recipe, isLoading } = useGetRecipe(id)

  if (isLoading) {
    return <Skeleton />
  }

  return <RecipeDetails recipe={recipe} />
}

export default ViewRecipe
