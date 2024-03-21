type EmptyExpensesDetailProps = {
  onAdd: () => void
}
const EmptyExpensesDetail = (props: EmptyExpensesDetailProps) => {
  const { onAdd } = props
  return (
    <div className="EmptyExpensesDetail flex flex-col gap-4 text-center">
      <p className="px-8">Track&apos;s clear! Time to add some expenses.</p>
      <button onClick={onAdd} className="btn btn-secondary">
        Add
      </button>
    </div>
  )
}

export default EmptyExpensesDetail
