import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import { useState } from 'react'

type DescriptionProps = {
  onBack: () => void
  description?: string
  onComplete: (description: string) => void
  test?: string
}

const Description = (props: DescriptionProps) => {
  const { onBack, onComplete } = props
  const [description, setDescription] = useState(props.description)
  return (
    <div className="screen">
      <Toolbar
        items={[
          <ToolbarButton
            key={1}
            onClick={onBack}
            icon={<ChevronLeftIcon className="w-6" />}
          />,
          <ToolbarTitle key={2} title="Description" />,
          <ToolbarButton
            key={1}
            onClick={() => {
              onBack()
              onComplete(description ?? '')
            }}
            label="Done"
          />,
        ]}
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
