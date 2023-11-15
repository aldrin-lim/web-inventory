type ToolbarTitleProps = {
  title: string
  description?: string
}

const ToolbarTitle: React.FC<ToolbarTitleProps> = ({ title, description }) => {
  return (
    <div className="flex flex-col gap-0 self-center text-center">
      <h1 className="font-bold">{title}</h1>
      {description && <p className="text-xs">{description}</p>}
    </div>
  )
}

export default ToolbarTitle
