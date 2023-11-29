import React, { useCallback, useEffect, useRef, useState } from 'react'
import { PhotoIcon, XMarkIcon, PlusIcon } from '@heroicons/react/24/solid'
import {
  AddProductActionType,
  useProductDetail,
} from 'screens/Product/contexts/ProductDetailContext'
import { Product } from 'types/product.types'

const ImageUpload = () => {
  const [images, setImages] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement | null>(null)

  const {
    dispatch,
    state: { productDetails },
  } = useProductDetail()

  const setProductValue = useCallback(
    (field: keyof Product, value: unknown) => {
      dispatch({
        type: AddProductActionType.UpdateProductDetail,
        payload: {
          field,
          value,
        },
      })
    },
    [dispatch],
  )

  const onChange = (images: string[]) => {
    setProductValue('images', images)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImageSrcs: string[] = []
      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          newImageSrcs.push(reader.result as string)
          if (newImageSrcs.length === files.length) {
            setImages((prev) => {
              onChange([...prev, ...newImageSrcs])
              return [...prev, ...newImageSrcs]
            })
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const onClick = () => {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }

  const deleteImage = (indexToDelete: number) => {
    setImages((prev) => {
      if (onChange) {
        onChange(prev.filter((_, index) => index !== indexToDelete))
      }
      return prev.filter((_, index) => index !== indexToDelete)
    })
  }

  const showAddImageButton = images.length > 0 && images.length < 5
  const showInitialImageButton = images.length === 0

  useEffect(() => {
    if (productDetails.images) {
      setImages(productDetails.images)
    }
  }, [productDetails.images])

  return (
    <div className="flex w-full max-w-xs flex-row gap-5 ">
      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
          id="fileInput"
          maxLength={5}
          disabled={images.length >= 5}
        />
        {showAddImageButton && (
          <button
            className="btn btn-square  mt-1 flex h-[100px] w-[100px] flex-col border-2 border-dashed border-gray-300 "
            onClick={onClick}
          >
            <PlusIcon className="w-8 text-success" />
          </button>
        )}
        {showInitialImageButton && (
          <button
            className="btn btn-square mt-1 flex h-[150px] w-[150px] flex-col"
            onClick={onClick}
          >
            <PhotoIcon className="w-14 " />
            <span className="text-xs ">Upload</span>
          </button>
        )}
      </div>
      <div className="flex max-w-xs flex-row  gap-3 overflow-x-auto">
        {images.map((image, index) => (
          <div key={index} className="relative">
            <div className="flex h-[150px] w-[150px] min-w-[150px] justify-center overflow-hidden rounded-md border bg-gray-100">
              <img src={image} alt="Uploaded preview" />
            </div>
            <button
              onClick={() => deleteImage(index)}
              className="btn btn-circle btn-outline btn-xs absolute right-2 top-2 "
            >
              <XMarkIcon className="w-4 " />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ImageUpload
