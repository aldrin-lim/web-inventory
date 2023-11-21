import { FixedSizeList as List } from 'react-window'
import { useInfiniteQuery } from '@tanstack/react-query'
import { getAllProducts } from 'api/product.api'
import {
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/solid'

import './styles.css'
import ImageLoader from 'components/ImageLoader'
import { useState } from 'react'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import { AppPath } from 'routes/AppRoutes.types'
import { useNavigate } from 'react-router-dom'
import MiddleTruncateText from 'components/MiddleTruncatedText'

const ProductList = () => {
  const navigate = useNavigate()
  const [page] = useState(0)
  const { data } = useInfiniteQuery(
    ['products'],
    ({ pageParam = 1 }) => getAllProducts({ limit: 100, page: pageParam }),
    {
      getNextPageParam: (lastPage, pages) => {
        if (page > 1 && lastPage.length < 10) return undefined
        return pages.length + 1
      },
    },
  )

  // const onNextPage = async () => {
  //   setPage((prev) => prev + 1)
  //   await fetchNextPage()
  // }

  const items = data?.pages.flatMap((page) => page) || []

  return (
    <div className="section flex flex-col gap-4">
      <Toolbar
        items={[
          <ToolbarButton
            key="back"
            label="Back"
            onClick={() => navigate(AppPath.ProductOverview)}
          />,
          <ToolbarTitle key="title" title="Inventory" />,
          <div key={1} />,
        ]}
      />
      <div className="form-control flex w-full flex-row justify-between ">
        <span>Restock Alert</span>
        <input type="checkbox" className="toggle toggle-primary" />
      </div>
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
          className="input join-item w-full "
        />
      </div>
      <div className="rounded-sm border border-gray-200 ">
        <List
          height={300} // adjust based on your layout
          itemCount={items.length}
          itemSize={47} // adjust based on your item size
          width={'100%'} // adjust based on your layout
          className="ProductList"
        >
          {({ index, style }) => {
            const product = items[index]
            const thumbnail = product.images && product.images[0]
            return (
              <div style={style} className="" key={product.name}>
                <button className="rounded-row btn btn-ghost flex w-full flex-row justify-start rounded-none border-b-gray-200 bg-gray-100">
                  <figure className="h-[24px] w-[24px]">
                    <ImageLoader
                      src={thumbnail}
                      iconClassName="w-6 text-gray-400"
                    />
                  </figure>
                  <span>
                    <MiddleTruncateText
                      text={items[index].name}
                      maxLength={25}
                    />
                  </span>
                  <ChevronRightIcon className="ml-auto w-5" />
                </button>
              </div>
            )
          }}
        </List>
      </div>
      {/* TODO: Implement once we change the response from get all products to have pagination info */}
      {/* {hasNextPage && (
        <button onClick={onNextPage} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? 'Loading...' : 'Load 10 More'}
        </button>
      )} */}
    </div>
  )
}

export default ProductList
