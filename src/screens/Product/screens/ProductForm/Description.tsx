import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import { produce } from 'immer'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useBoundStore from 'stores/useBoundStore'

const Description = () => {
  const navigate = useNavigate()

  const [description, setDescription] = useState('')
  const setInitialValue = useBoundStore(
    (state) => state.setProdutctFormInitialValue,
  )
  const formValue = useBoundStore((state) => state.productFormValue)
  const productFormValues = useBoundStore(
    (state) => state.productFormInitialValue,
  )

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
              setInitialValue(
                produce(productFormValues, (draft) => {
                  draft.description = description
                }),
              )
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
