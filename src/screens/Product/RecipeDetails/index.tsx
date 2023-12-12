import { AddProductSchema } from 'api/product/createProduct'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import { Formik } from 'formik'
import { AppPath } from 'routes/AppRoutes.types'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import ProductImages from '../ProductDetail/components/ProductImages'
import { useNavigate } from 'react-router-dom'
import { PlusIcon } from '@heroicons/react/24/solid'
import ImageLoader from 'components/ImageLoader'
import MeasurementSelect from '../ProductDetail/components/MeasurementSelect'
import { useState } from 'react'
import SlidingTransition from 'components/SlidingTransition'
import ProductSelectionList from './InventoryList'

const RecipeDetails = () => {
  const [showProductSelectionList, setShowProductSelectionList] =
    useState(false)
  const navigate = useNavigate()

  const onSubmit = () => {}

  return (
    <>
      <div className="section flex h-full min-h-screen w-full flex-col gap-4">
        <Formik
          initialValues={{}}
          onSubmit={onSubmit}
          validationSchema={toFormikValidationSchema(AddProductSchema)}
          validateOnChange={false}
        >
          {() => {
            return (
              <>
                <Toolbar
                  items={[
                    <ToolbarButton
                      key={1}
                      label="Cancel"
                      onClick={() => navigate(AppPath.RecipeOverview)}
                    />,
                    <ToolbarTitle key={2} title="Add Recipe" />,
                    <ToolbarButton key={3} label="Save" />,
                  ]}
                />
                <ProductImages images={[]} onImagesChange={() => {}} />
                <input
                  type="text"
                  placeholder="Recipe Name"
                  className="input input-bordered w-full"
                />
                <div className="flex w-full flex-row justify-between">
                  <p>Cost</p>

                  <p>
                    <strong>₱ 0.00</strong>
                  </p>
                </div>
                <div className="SCROLLABLE flex h-fit w-full flex-grow overflow-hidden">
                  <div className="flex h-full w-full flex-col gap-4">
                    <div className="flex flex-row justify-between">
                      <h1>Materials</h1>
                      <button
                        className="btn btn-ghost btn-sm text-blue-400"
                        onClick={() => setShowProductSelectionList(true)}
                      >
                        <PlusIcon className="w-5 " />
                        Add
                      </button>
                    </div>
                    <div className="flex h-full flex-grow overflow-y-hidden">
                      <div>
                        {/* <button className="btn btn-square  mt-1 flex h-[100px] w-[100px] flex-col border-2 border-dashed border-gray-300 ">
                        <PlusIcon className="w-8 text-success" />
                      </button> */}

                        <div className="container-card flex flex-row flex-wrap justify-evenly gap-2">
                          <div className="card card-compact w-[155px] cursor-pointer border border-gray-300 bg-base-100">
                            <figure className="h-[155px] w-[155px] bg-gray-300">
                              <ImageLoader
                                src={'https://placehold.co/600x400/png'}
                                iconClassName="w-24 text-gray-400"
                              />
                            </figure>
                            <div className="card-body flex flex-col gap-2 !px-1 !py-2 text-left">
                              <h2 className="card-title text-sm">
                                Lorem ipsum Dolor Lorem ipusum Dolor
                              </h2>

                              <div className="flex flex-row gap-1 text-xs">
                                <div className="join flex border border-gray-300">
                                  <button className="join-itm btn">-</button>
                                  <input
                                    type="number"
                                    inputMode="numeric"
                                    className="input join-item w-full p-0 text-center text-black"
                                  />
                                  <button className="btn  join-item">+</button>
                                </div>
                              </div>

                              <MeasurementSelect
                                onChange={() => {}}
                                value={{
                                  label: 'pieces',
                                  value: 'pieces',
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )
          }}
        </Formik>
      </div>
      <SlidingTransition
        direction="bottom"
        isVisible={showProductSelectionList}
        zIndex={10}
      >
        <ProductSelectionList
          onClose={() => setShowProductSelectionList(false)}
        />
      </SlidingTransition>
    </>
  )
}

export default RecipeDetails
