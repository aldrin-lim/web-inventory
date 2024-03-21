import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import UpdateActionMenu from '../UpdateActionMenu'

type PrimaryActionProps = {
  disabled?: boolean
  isLoading?: boolean
  onCreate: () => void
  onDelete: () => void
  onSave: () => void
  onClone: () => void
  mode?: 'add' | 'edit'
}

const PrimaryAction = (props: PrimaryActionProps) => {
  const {
    disabled = false,
    isLoading = false,
    onClone,
    onCreate,
    onDelete,
    onSave,
    mode = 'add',
  } = props
  if (mode === 'add') {
    return (
      <ToolbarButton
        label={mode === 'add' ? 'Save' : 'Update'}
        onClick={onCreate}
        disabled={disabled || isLoading}
      />
    )
  } else {
    return (
      <UpdateActionMenu
        isLoading={isLoading}
        onDelete={onDelete}
        onSave={onSave}
        onClone={onClone}
      />
    )
  }
}

export default PrimaryAction
