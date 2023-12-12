import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import { useEffect, useMemo, useState } from 'react'
import { Product, ProductVariant } from 'types/product.types'
import VariantOptionItem from './components/VariantOptionItem'
import { ProductVariantDetailProvider } from 'screens/Product/contexts/ProductVariantDetailContext'
import ProductVariantDetail from '../../../ProductVariantDetail'

type VariantOptionFormProps = {
  variants: NonNullable<Product['variants']>
  onClose: () => void
  onSave: (variants: NonNullable<Product['variants']>) => void
}

const VariantOptionForm = (props: VariantOptionFormProps) => {
  const [variants, setVariants] = useState<NonNullable<Product['variants']>>([])
  const [currentVariant, setCurrentVariant] = useState<{
    variant: ProductVariant
    index: number
  } | null>(null)

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
        const newValue = [...prev]
        newValue[index] = {
          ...prev[index],
          [key]: value,
        }
        return newValue
      }
      return prev
    })
  }

  const onSave = () => {
    props.onSave(variants)
  }

  useEffect(() => {
    console.log(JSON.stringify(variants, null, 2))
  }, [variants])

  return (
    <>
      {currentVariant && (
        <ProductVariantDetailProvider productDetails={currentVariant.variant}>
          <ProductVariantDetail
            onClose={() => setCurrentVariant(null)}
            onSave={(variant) => {
              setVariants((prev) => {
                if (prev[currentVariant.index]) {
                  prev[currentVariant.index] = variant
                  return prev
                }

                return prev
              })
              setCurrentVariant(null)
            }}
          />
        </ProductVariantDetailProvider>
      )}
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
              onEdit={(currentVariant) => setCurrentVariant(currentVariant)}
              variant={variant}
              onVariantChange={(key, value) => onChange(index, key, value)}
              key={index}
              index={index}
            />
          ))}
        </div>
      </div>
    </>
  )
}

export default VariantOptionForm
