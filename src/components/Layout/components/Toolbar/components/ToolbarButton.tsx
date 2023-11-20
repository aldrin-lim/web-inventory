type ToolbarButtonProps = {
  label?: string
  onClick?: () => void
  icon?: React.ReactNode
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  label,
  onClick,
  icon,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="btn btn-link px-0 normal-case text-blue-400 no-underline"
    >
      {label}
      {icon}
    </button>
  )
}

export default ToolbarButton
