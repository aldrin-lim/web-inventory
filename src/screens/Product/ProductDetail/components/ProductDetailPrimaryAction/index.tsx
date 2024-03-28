import UpdateActionMenu from '../UpdateActionMenu'

type PrimaryActionProps = {
  onDelete: () => void
  onSave: () => void
  onClone: () => void
}

const PrimaryAction = (props: PrimaryActionProps) => {
  const { onClone, onDelete, onSave } = props
  return (
    <UpdateActionMenu onDelete={onDelete} onSave={onSave} onClone={onClone} />
  )
}

export default PrimaryAction
