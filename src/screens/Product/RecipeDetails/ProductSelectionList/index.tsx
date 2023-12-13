import { FixedSizeList as List } from 'react-window'
import { useInfiniteQuery } from '@tanstack/react-query'
import {
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/solid'

import ImageLoader from 'components/ImageLoader'
import { useEffect, useMemo, useState } from 'react'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import { useSearchParams } from 'react-router-dom'
import MiddleTruncateText from 'components/MiddleTruncatedText'
import { z } from 'zod'
import useMediaQuery, { ScreenSize } from 'hooks/useMediaQuery'
import * as API from 'api/product'
import {
  RecipeDetailActionType,
  useRecipeDetail,
} from 'screens/Product/contexts/RecipeDetailContext'
import { Product } from 'types/product.types'

const getTruncateSize = (size: ScreenSize) => {
  switch (size) {
    case 'xs':
      return 10
    case 'sm':
      return 25
    case 'md':
      return 200
    case 'lg':
      return 200
    default:
      return 500
  }
}

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

type ProductSelectionListProps = {
  onClose: () => void
}

const ProductSelectionList = (props: ProductSelectionListProps) => {
  const [searchParams] = useSearchParams()
  const [page] = useState(0)

  const { currentBreakpoint } = useMediaQuery({ updateOnResize: true })

  const {
    dispatch,
    state: {
      recipeDetails: { materials },
    },
  } = useRecipeDetail()

  const [enableFilter, setEnableFilter] = useState(false)
  const [outOfStockFilter, setOutOfStockFilter] = useState<
    boolean | undefined
  >()
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 100)

  const { data, isLoading, error } = useInfiniteQuery(
    ['products'],
    ({ pageParam = 1 }) => API.getAllProducts({ limit: 100, page: pageParam }),
    {
      getNextPageParam: (lastPage, pages) => {
        if (page > 1 && lastPage.length < 10) return undefined
        return pages.length + 1
      },
      retry: 2,
    },
  )

  const filteredProducts = useMemo(() => {
    let items = data?.pages.flatMap((page) => page) || []

    // Apply out-of-stock filter
    if (enableFilter && typeof outOfStockFilter === 'boolean') {
      items = items.filter((item) =>
        outOfStockFilter ? item.quantity === 0 : item.quantity > 0,
      )
    }

    // Apply search filter
    if (debouncedSearchTerm) {
      items = items.filter((item) =>
        item.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
      )
    }

    return items
  }, [data?.pages, enableFilter, outOfStockFilter, debouncedSearchTerm])

  useEffect(() => {
    const paramsObject = Object.fromEntries(searchParams) as {
      outOfStock?: boolean
    }

    const queryParamsSchema = z.object({
      outOfStock: z.enum(['true', 'false']),
    })

    const queryParamValidation = queryParamsSchema.safeParse(paramsObject)

    if (queryParamValidation.success) {
      setEnableFilter(true)
      setOutOfStockFilter(
        Boolean(queryParamValidation.data.outOfStock === 'true'),
      )
    }
  }, [searchParams])

  const onClick = (product: Product) => {
    const isMaterialExisting = materials.find(
      (m) => m.product.id === product.id,
    )
    if (!isMaterialExisting) {
      dispatch({
        type: RecipeDetailActionType.AddMaterial,
        payload: {
          quantity: 0,
          product,
          measurement: product.measurement || 'pieces',
        },
      })
    }

    props.onClose()
  }

  return (
    <div className="section absolute flex min-h-screen w-full flex-col gap-4 bg-base-100">
      <Toolbar
        items={[
          <ToolbarButton key="back" label="Back" onClick={props.onClose} />,
          <ToolbarTitle key="title" title="Inventory" />,
          <div key={1} />,
        ]}
      />
      <div>
        <div className="join w-full border py-0">
          <button
            className="btn btn-ghost join-item !bg-transparent px-2 pr-1 !text-black"
            disabled
          >
            <MagnifyingGlassIcon className="w-5" />
          </button>
          <input
            type="text"
            placeholder="Search"
            className="input join-item w-full"
            disabled={isLoading}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="rounded-sm border border-gray-200 ">
        {!isLoading && Boolean(error) && (
          <div className="my-auto flex h-[400px] w-full items-center justify-center p-6 text-center">
            <p className="text-center text-xs text-gray-400">
              We&apos;re having a bit of trouble fetching your data. Hang tight,
              we&apos;re on it
            </p>
          </div>
        )}
        {isLoading && (
          <>
            <div className="flex flex-col">
              <div className="skeleton h-[47px] w-full rounded-none" />
              <div className="skeleton h-[47px] w-full rounded-none" />
              <div className="skeleton h-[47px] w-full rounded-none" />
              <div className="skeleton h-[47px] w-full rounded-none" />
              <div className="skeleton h-[47px] w-full rounded-none" />
              <div className="skeleton h-[47px] w-full rounded-none" />
              <div className="skeleton h-[47px] w-full rounded-none" />
              <div className="skeleton h-[47px] w-full rounded-none" />
              <div className="skeleton h-[47px] w-full rounded-none" />
            </div>
          </>
        )}
        {!error && !isLoading && (
          <List
            height={400} // adjust based on your layout
            itemCount={filteredProducts.length}
            itemSize={47} // adjust based on your item size
            width={'100%'} // adjust based on your layout
            className="ProductList"
          >
            {({ index, style }) => {
              const product = filteredProducts[index]
              const thumbnail = product.images && product.images[0]
              return (
                <div style={style} className="" key={product.name}>
                  <button
                    onClick={() => onClick(product as Product)}
                    className="rounded-row btn btn-ghost no-animation flex w-full flex-row justify-start rounded-none border-b-gray-200 bg-gray-100"
                  >
                    <figure className="h-[24px] w-[24px]">
                      <ImageLoader
                        src={thumbnail}
                        iconClassName="w-6 text-gray-400"
                      />
                    </figure>
                    <div className="flex flex-row gap-2 text-left">
                      <div>
                        <p>
                          <MiddleTruncateText
                            text={product.name}
                            maxLength={getTruncateSize(currentBreakpoint)}
                          />
                        </p>
                        <p className="ml-auto text-xs font-normal">
                          {product.quantity || 0} available
                        </p>
                      </div>
                    </div>
                    <div className="ml-auto">
                      <div className="flex flex-row gap-3">
                        <p>₱ {product.price}</p>

                        <ChevronRightIcon className=" w-5" />
                      </div>
                    </div>
                  </button>
                </div>
              )
            }}
          </List>
        )}
      </div>
    </div>
  )
}

export default ProductSelectionList
