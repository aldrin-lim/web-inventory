import SlidingTransition from 'components/SlidingTransition'
import ProductSelectionList from './ProductSelectionList'
import RecipeDetailsForm from './RecipeDetailsForm'
import {
  RecipeDetailActionType,
  RecipeDetailActiveScreen,
  useRecipeDetail,
} from '../contexts/RecipeDetailContext'

const RecipeDetails = () => {
  const {
    state: { recipeDetails, activeScreen },
    dispatch,
  } = useRecipeDetail()

  const onSubmit = () => {}

  const closeProductSelection = () => {
    dispatch({
      type: RecipeDetailActionType.UpdateActiveScreen,
      payload: {
        screen: RecipeDetailActiveScreen.None,
      },
    })
  }

  return (
    <>
      <div className="section flex h-full min-h-screen w-full flex-col gap-4">
        <RecipeDetailsForm initialValue={recipeDetails} onSubmit={onSubmit} />
      </div>
      <SlidingTransition
        direction="bottom"
        isVisible={activeScreen === RecipeDetailActiveScreen.ProductSelection}
        zIndex={10}
      >
        <ProductSelectionList onClose={closeProductSelection} />
      </SlidingTransition>
    </>
  )
}

export default RecipeDetails
