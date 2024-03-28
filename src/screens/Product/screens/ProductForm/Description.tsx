import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useProductFormValue from 'screens/Product/hooks/useProductFormValue'

const Description = () => {
  const navigate = useNavigate()

  const [description, setDescription] = useState('')
  const setFormFieldValue = useProductFormValue(
    (state) => state.setFormFieldValue,
  )
  const formValue = useProductFormValue((state) => state.formValue)

  useEffect(() => {
    setDescription(formValue?.description ?? '')
  }, [formValue])

  return (
    <div className="screen absolute bg-base-100">
      <Toolbar
        start={
          <ToolbarButton
            onClick={() => navigate('../')}
            icon={<ChevronLeftIcon className="w-6" />}
          />
        }
        middle={<ToolbarTitle title="Description" />}
        end={
          <ToolbarButton
            onClick={() => {
              setFormFieldValue('description', description)
              navigate('../')
            }}
            label="Done"
          />
        }
      />
      <div>
        <textarea
          className="input input-bordered h-full w-full p-4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          placeholder="Write a description for your product..."
        />
      </div>
    </div>
  )
}

export default Description
