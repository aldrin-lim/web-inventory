type ToolbarButtonProps = {
  label: string
  onClick?: () => void
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ label, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="btn btn-link px-0 normal-case text-blue-400 no-underline"
    >
      {label}
    </button>
  )
}

export default ToolbarButton
