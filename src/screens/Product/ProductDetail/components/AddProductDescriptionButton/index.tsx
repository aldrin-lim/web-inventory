import { ChevronRightIcon } from '@heroicons/react/24/solid'
type AddProductDescriptionButton = {
  description?: string
  onClick: () => void
}

const AddProductDescriptionButton = (props: AddProductDescriptionButton) => {
  const { onClick, description } = props

  return (
    <button
      onClick={onClick}
      className="btn  btn-primary btn-sm flex w-full flex-row justify-between p-0 normal-case"
    >
      <span className="col-span-11 w-4/5 truncate overflow-ellipsis text-left text-gray-400">
        {description || 'Add Description'}
      </span>
      <ChevronRightIcon className="col-span-1 w-5" />
    </button>
  )
}

export default AddProductDescriptionButton
