import {
  CheckIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid'
import { useState } from 'react'

type OptionValueItemProps = {
  value: string
  allValues: string[]
  onUpdate: (newValue: string) => void
  onRemove: () => void
}

const OptionValueItem = (props: OptionValueItemProps) => {
  const { value, onRemove, onUpdate, allValues } = props

  const [isEditing, setIsEditing] = useState(false)
  const [editedValue, setEditedValue] = useState(value)
  const [error, setError] = useState('')

  const handleEdit = () => {
    setIsEditing(true)
    setError('')
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedValue(value)
    setError('')
  }

  const handleSave = () => {
    if (allValues.includes(editedValue) && editedValue !== value) {
      setError('Duplicate value')
      return
    }
    onUpdate(editedValue)
    setIsEditing(false)
  }

  return (
    <div className="form-control">
      <div className="flex w-full flex-row items-center justify-center gap-1">
        {isEditing ? (
          <input
            className="input w-full !text-base"
            value={editedValue}
            onChange={(e) => setEditedValue(e.target.value)}
          />
        ) : (
          <input className="input w-full !text-base" disabled value={value} />
        )}

        {isEditing ? (
          <>
            <button onClick={handleSave} className="btn btn-ghost btn-sm">
              <CheckIcon className="w-4" />
            </button>
            <button onClick={handleCancel} className="btn btn-ghost btn-sm">
              <XMarkIcon className="w-4" />
            </button>
          </>
        ) : (
          <>
            <button onClick={handleEdit} className="btn btn-ghost btn-sm">
              <PencilIcon className="w-4" />
            </button>
            <button onClick={onRemove} className="btn btn-ghost btn-sm">
              <TrashIcon className="w-4" />
            </button>
          </>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

export default OptionValueItem
