import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import { useEffect, useState } from 'react'

type AddDescriptionProps = {
  onBack: () => void
  onSave: (description: string) => void
  description?: string
}

const AddDescription = (props: AddDescriptionProps) => {
  const [description, setDescription] = useState(props.description || '')

  useEffect(() => {
    scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  const onSave = () => {
    props.onSave(description)
    props.onBack()
  }

  const goBack = () => {
    props.onBack()
  }

  return (
    <div>
      <Toolbar
        start={<ToolbarButton label="Cancel" onClick={goBack} />}
        middle={<ToolbarTitle title="Description" />}
        end={<ToolbarButton label="Done" onClick={onSave} />}
      />
      <textarea
        onChange={(e) => setDescription(e.target.value)}
        value={description}
        className="textarea textarea-bordered h-auto w-full text-base"
        placeholder="Add description"
        autoFocus
        rows={5}
      />
    </div>
  )
}

export default AddDescription
