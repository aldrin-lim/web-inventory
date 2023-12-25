import { ArrowSmallLeftIcon } from '@heroicons/react/24/solid'
import Toolbar from 'components/Layout/components/Toolbar'

type AddStaffProps = {
  onClose: () => void
}

const AddStaff = (props: AddStaffProps) => {
  const { onClose } = props

  return (
    <div className="section flex w-full flex-col gap-2 pt-0">
      <Toolbar
        items={[
          <label
            key="12"
            className="btn btn-square btn-ghost drawer-button -ml-4"
            onClick={onClose}
          >
            <ArrowSmallLeftIcon className="w-6 text-blue-400" />
          </label>,
        ]}
      />
      Add Staff
    </div>
  )
}

export default AddStaff
