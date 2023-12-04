import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import { useMemo, useState } from 'react'
import { Product, ProductVariant } from 'types/product.types'
import VariantOptionItem from './components/VariantOptionItem'

type VariantOptionFormProps = {
  variants: NonNullable<Product['variants']>
  onClose: () => void
  onSave: (variants: NonNullable<Product['variants']>) => void
}

const VariantOptionForm = (props: VariantOptionFormProps) => {
  const [variants, setVariants] = useState<NonNullable<Product['variants']>>([])

  useMemo(() => {
    setVariants([...props.variants])
  }, [props.variants])

  const onChange = (
    index: number,
    key: keyof ProductVariant,
    value: unknown,
  ) => {
    setVariants((prev) => {
      if (prev[index]) {
        prev[index] = {
          ...prev[index],
          [key]: value,
        }
        return prev
      }
      return prev
    })
  }

  const onSave = () => {
    props.onSave(variants)
  }

  return (
    <div>
      <Toolbar
        items={[
          <ToolbarButton key={1} label="Cancel" onClick={props.onClose} />,
          <ToolbarTitle key={2} title="Variant Info" />,
          <ToolbarButton key={3} label="Save" onClick={onSave} />,
        ]}
      />

      <div className="flex flex-col gap-2">
        {variants.map((variant: ProductVariant, index: number) => (
          <VariantOptionItem
            variant={variant}
            onVariantChange={(key, value) => onChange(index, key, value)}
            key={index}
          />
        ))}
      </div>
    </div>
  )
}

export default VariantOptionForm
