import {
  EllipsisVerticalIcon,
  PencilSquareIcon,
  DocumentDuplicateIcon,
  TrashIcon,
} from '@heroicons/react/24/solid'
import { useState } from 'react'

type UpdateActionMenuProps = {
  onSave?: () => void
  onDelete?: () => void
  onClone?: () => void
  isLoading?: boolean
}

type Action = 'save' | 'delete' | 'clone' | 'update' | ''

const UpdateActionMenu = (props: UpdateActionMenuProps) => {
  const [action, setAction] = useState<Action>('')
  const [open, setOpen] = useState(false)

  const onSave = async () => {
    try {
      setAction('save')
      if (props.onSave) {
        await props.onSave()
      }
    } finally {
      setOpen((prev) => !prev)
      setAction('')
    }
  }

  const onClone = async () => {
    try {
      setAction('clone')
      if (props.onClone) {
        await props.onClone()
      }
    } finally {
      setOpen((prev) => !prev)
      setAction('')
    }
  }

  const onDelete = async () => {
    try {
      setAction('delete')
      if (props.onDelete) {
        await props.onDelete()
      }
    } finally {
      setOpen((prev) => !prev)
      setAction('')
    }
  }

  return (
    <div
      tabIndex={0}
      className={[
        'dropdown dropdown-end inline-flex w-auto',
        open ? 'dropdown-open' : '',
      ].join(' ')}
      onBlur={() => {
        setOpen(false)
      }}
    >
      <label
        onClick={() => setOpen((prev) => !prev)}
        className="btn btn-link px-0 normal-case text-blue-400 no-underline "
      >
        <EllipsisVerticalIcon className="w-6 text-blue-400" />
      </label>
      {open && (
        <div className="dop menu dropdown-content top-10 z-[1] flex w-36 flex-col overflow-hidden rounded-md bg-base-100 p-0 shadow">
          <button
            disabled={props.isLoading}
            onClick={onSave}
            className="btn btn-ghost  flex flex-row justify-start gap-3 rounded-none "
          >
            <PencilSquareIcon className="w-5" />
            <span>Save</span>

            {action === 'save' && (
              <span className="loading loading-spinner loading-xs"></span>
            )}
          </button>
          <button
            disabled={props.isLoading}
            onClick={onClone}
            className="btn btn-ghost  flex flex-row justify-start gap-3 rounded-none "
          >
            <DocumentDuplicateIcon className="w-5" />
            <span>Clone</span>
            {action === 'clone' && (
              <span className="loading loading-spinner loading-xs"></span>
            )}
          </button>
          <button
            disabled={props.isLoading}
            onClick={onDelete}
            className="btn btn-ghost  flex flex-row justify-start gap-3 rounded-none "
          >
            <TrashIcon className="w-5" />
            <span>Delete</span>
            {action === 'delete' && (
              <span className="loading loading-spinner loading-xs"></span>
            )}
          </button>
        </div>
      )}
    </div>
  )
}

export default UpdateActionMenu
