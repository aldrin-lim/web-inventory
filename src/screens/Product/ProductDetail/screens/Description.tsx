import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import { useState } from 'react'

type DescriptionProps = {
  onBack: () => void
  description?: string
  onComplete: (description: string) => void
}

const Description = (props: DescriptionProps) => {
  const { onBack, onComplete } = props
  const [description, setDescription] = useState(props.description)
  return (
    <div className="screen">
      <Toolbar
        start={
          <ToolbarButton
            onClick={onBack}
            icon={<ChevronLeftIcon className="w-6" />}
          />
        }
        middle={<ToolbarTitle title="Description" />}
        end={
          <ToolbarButton
            onClick={() => {
              onBack()
              onComplete(description ?? '')
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
