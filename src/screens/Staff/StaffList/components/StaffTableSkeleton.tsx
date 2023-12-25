const StaffTableSkeleton = () => {
  return (
    <div className="overflow-x-auto">
      {/* Desktop Table */}
      <div className="hidden w-full md:block">
        <div className="skeleton my-4 h-[15px] w-full" />
        <div className="skeleton my-4 h-[15px] w-full" />
        <div className="skeleton my-4 h-[15px] w-full" />
        <div className="skeleton my-4 h-[15px] w-full" />
        <div className="skeleton my-4 h-[15px] w-full" />
      </div>

      {/* Mobile Table */}
      <div className="flex flex-col gap-4 md:hidden">
        <div className="block rounded-md border border-gray-200 px-4 py-2">
          <div className="flex flex-col gap-4">
            <div className="skeleton h-[19px] w-full rounded-md" />
            <div className="skeleton h-[19px] w-full rounded-md" />
            <div className="skeleton h-[19px] w-full rounded-md" />
            <div className="skeleton h-[19px] w-full rounded-md" />
            <div className="skeleton h-[19px] w-full rounded-md" />
            <div className="skeleton h-[19px] w-full rounded-md" />
          </div>
        </div>
        <div className="block rounded-md border border-gray-200 px-4 py-2">
          <div className="flex flex-col gap-4">
            <div className="skeleton h-[19px] w-full rounded-md" />
            <div className="skeleton h-[19px] w-full rounded-md" />
            <div className="skeleton h-[19px] w-full rounded-md" />
            <div className="skeleton h-[19px] w-full rounded-md" />
            <div className="skeleton h-[19px] w-full rounded-md" />
            <div className="skeleton h-[19px] w-full rounded-md" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default StaffTableSkeleton
