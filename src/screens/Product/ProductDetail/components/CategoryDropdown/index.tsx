import { useState } from 'react'
import Select from 'react-select'
import { OnChangeValue } from 'react-select'

import './styles.css'

// Define the type for a category option
interface CategoryOption {
  label: string
  value: string
}

type CategoryDropdownProps = {
  value?: CategoryOption | string
  onChange?: (value: CategoryOption | null) => void
}

// Initial category options
const initialCategories: CategoryOption[] = [
  { value: 'Beverage', label: 'Beverage' },
  { value: 'Food', label: 'Food' },
  { value: 'Ingredients', label: 'Ingredients' },
]

const CategoryDropdown = (props: CategoryDropdownProps) => {
  const value = props.value
    ? typeof props.value === 'string'
      ? { label: props.value, value: props.value }
      : props.value
    : null

  const [selectedCategory, setSelectedCategory] =
    useState<CategoryOption | null>(value)

  // Handle change event
  const handleChange = (newValue: OnChangeValue<CategoryOption, false>) => {
    setSelectedCategory(newValue as CategoryOption)
    props.onChange?.(newValue as CategoryOption)
  }

  return (
    <Select<CategoryOption, false>
      isClearable
      isSearchable={false}
      onChange={handleChange}
      options={initialCategories}
      value={selectedCategory}
      placeholder="Select or create a category (optional)"
      className="category-selection"
      classNamePrefix="select"
    />
  )
}

export default CategoryDropdown
