import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import useGetProduct from 'hooks/useGetProduct'
import useGetRecipe from 'hooks/useGetRecipe'
import { useParams } from 'react-router-dom'
import ProductDetail from 'screens/Product/ProductDetail'
import { ProductDetailProvider } from 'screens/Product/contexts/ProductDetailContext'
import RecipeDetails from '../RecipeDetails'

const Skeleton = () => (
  <div className="section relative flex flex-col gap-4 pt-0">
    <Toolbar
      items={[
        <ToolbarButton key="cancel" label="Cancel" disabled />,
        <ToolbarTitle key="title" title="View Product" />,
        <ToolbarButton key="save" label="Save" disabled />,
      ]}
    />

    <div className="skeleton h-[47px] w-full rounded-md" />
    <div className="skeleton h-[24px] w-full rounded-md" />
    <div className="skeleton h-[96px] w-full rounded-md" />
    <div className="skeleton h-[154px] w-full rounded-md" />
    <div className="skeleton h-[47px] w-full rounded-md" />
  </div>
)

const ViewRecipe = () => {
  const { id } = useParams<{ id: string }>()

  const { recipe, isLoading } = useGetRecipe(id)

  if (isLoading) {
    return <Skeleton />
  }

  return <RecipeDetails recipe={recipe} />
}

export default ViewRecipe
