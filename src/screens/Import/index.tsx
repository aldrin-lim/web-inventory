import {
  ArrowDownIcon,
  ArrowDownOnSquareIcon,
  ArrowUpOnSquareIcon,
  Bars3Icon,
  CloudArrowUpIcon,
  InformationCircleIcon,
  PlusIcon,
  TrashIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import { useRef, useState } from 'react'
import { useNavigate, useResolvedPath } from 'react-router-dom'
import Papa from 'papaparse'
import { Field, FieldArray, FieldProps, Formik } from 'formik'
import { z } from 'zod'
import { toNumber } from 'lodash'
import CurrencyInput from 'react-currency-input-field'
import MeasurementSelect, {
  getMeasurementOptionsValue,
} from 'screens/Product/ProductDetail/components/MeasurementSelect'
import { measurementOptions } from 'util/measurement'

import './styles.css'
import { toast } from 'react-toastify'
import useImportProducts from 'hooks/useImportProducts'

type ParsedData = {
  Name: string
  Description: string
  Cost: string
  Price: string
  Category: string
  AllowBackOrder: string
  UnitOfMeasurement: string
  CostPerUnit: string
  Quantity: string
  Expiration: string
}

type TransformedParsedData = {
  id: string
  name: string
  description: string
  cost: string
  price: string
  category: string
  allowBackOrder: string
  unitOfMeasurement: string
  costPerUnit: string
  quantity: string
  expiration: string
}
const Import = () => {
  const navigate = useNavigate()
  const [showGuide, setShowGuide] = useState(false)
  const resolvedPath = useResolvedPath('')
  const isParentScreen = location.pathname === resolvedPath.pathname

  const { isImporting, importProducts } = useImportProducts()

  const inputRef = useRef<HTMLInputElement | null>(null)

  const [parsedData, setParsedData] = useState<null | TransformedParsedData[]>(
    null,
  )
  const [errorRows, setErrorRows] = useState<number[]>([])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0]

    if (file) {
      Papa.parse<ParsedData>(file, {
        complete: (result) => {
          console.log('Parsed Result:', result)
          if (result.data.length > 0) {
            setParsedData(
              result.data.map((res, index) => {
                const newRes = res as unknown as TransformedParsedData
                console.log(newRes)
                return {
                  ...newRes,
                  cost: toNumber(newRes.cost),
                  price: toNumber(newRes.price),
                  id: index + 1,
                }
              }) as unknown as TransformedParsedData[],
            )
          }
          if (result.errors.length > 0) {
            const rows = result.errors
              .filter(
                (error) =>
                  error.row !== undefined && error.code !== 'TooManyFields',
              )
              .map((error) => (toNumber(error.row) + 1) as number)
            setErrorRows(rows)
          } else {
            setErrorRows([])
          }
        },
        skipEmptyLines: true,
        header: true,
        dynamicTyping: true,
        transformHeader: (header) => {
          console.log('Header:', header)
          switch (header) {
            case 'Name':
              return 'name'
            case 'Description':
              return 'description'
            case 'Cost':
              return 'cost'
            case 'Price':
              return 'price'
            case 'Category':
              return 'category'
            case 'AllowBackOrder':
              return 'allowBackOrder'
            case 'UnitOfMeasurement':
              return 'unitOfMeasurement'
            case 'CostPerUnit':
              return 'costPerUnit'
            case 'Quantity':
              return 'quantity'
            case 'Expiration':
              return 'expiration'
            default:
              return header
          }
        },
      })
    }
  }

  const onUploadClick = () => {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }

  return (
    <>
      <dialog
        className="modal"
        style={{
          background: 'rgba(0,0,0,.4)',
        }}
        open={showGuide}
      >
        <div className="modal-box p-0">
          <h1 className="sticky top-0 flex flex-row justify-between bg-base-100 p-4">
            <span className="text-lg font-bold">
              How to import your products
            </span>
            <button
              onClick={() => setShowGuide(false)}
              className="btn btn-ghost -mr-3 -mt-3"
            >
              <XMarkIcon className="w-6" />{' '}
            </button>
          </h1>
          <div className="p-4">
            <div>
              <ol className="list-decimal space-y-4 px-4 text-base">
                <li>
                  Download the CSV template and fill in the required fields. You
                  can use Microsoft Excel or Google Spreadsheet to edit the CSV
                  file.
                </li>
                <li>
                  Ensure that the data in the CSV file is consistent with the
                  column guidelines below.
                </li>
              </ol>
            </div>
            <p className="mt-4 px-4 text-sm text-gray-700">
              (All columns with <span className="text-red-500">*</span> are
              required)
            </p>
            <ul className="mt-4 flex flex-col gap-4 px-4 pb-20 text-sm ">
              <li>
                <strong>Name:</strong>
                <span className="text-red-500">*</span> The name of the product.
                This should be a unique identifier.
              </li>
              <li>
                <strong>Description:</strong>A short yet informative description
                of the product, highlighting its key features.
              </li>
              <li>
                <strong>Cost:</strong>
                <span className="text-red-500">*</span> The amount incurred to
                produce or acquire the product or service
              </li>
              <li>
                <strong>Price:</strong>
                <span className="text-red-500">*</span> The selling price of the
                product or service. This is the amount customers pay to purchase
                the produc.
              </li>
              <li>
                <strong>Category:</strong> The classification of the product.
                Use predefined categories: &apos;Food&apos;,
                &apos;Beverage&apos;, &apos;Ingredients&apos;.
              </li>
              <li>
                <strong>AllowBackOrder:</strong> Indicate with &apos;Y&apos;
                (Yes) or &apos;N&apos; (No) whether the product can be sold even
                when it is out of stock. &apos;Y&apos; allows back orders, while
                &apos;N&apos; does not.
              </li>
              <li>
                <strong>UnitOfMeasurement:</strong>
                <span className="text-red-500">*</span> Specifies how the
                product is measured and sold. Examples include &apos;pcs&apos;
                for pieces, &apos;g&apos; for grams, &apos;ml&apos; for
                milliliters, &apos;kg&apos; for kilograms, etc. Choose the most
                appropriate unit for your product.
              </li>
              <li>
                <strong>CostPerUnit:</strong> The initial stock quantity of the
                product. After importing, this field can be adjusted to track
                batches, SKUs, different quantities, costs, or expiration dates
                for more precise inventory management.
              </li>
              <li>
                <strong>Quantity:</strong>
                <span className="text-red-500">*</span> The initial stock
                quantity of the product. After importing, this field can be
                adjusted to track batches, SKUs, different quantities, costs, or
                expiration dates for more precise inventory management.
              </li>
              <li>
                <strong>Expiration:</strong> The expiration date of the product,
                if applicable. Use the format YYYY-MM-DD to ensure consistency
                and avoid confusion.
              </li>
            </ul>
          </div>
        </div>
      </dialog>
      <div className={isParentScreen ? 'screen ' : 'hidden'}>
        <Toolbar
          start={
            <label
              htmlFor="my-drawer"
              className="btn btn-link px-0 normal-case text-blue-400 no-underline disabled:bg-transparent disabled:text-gray-400"
            >
              <Bars3Icon className="w-6" />
            </label>
          }
          middle={<ToolbarTitle title="Import Products" />}
        />
        {!parsedData && (
          <div className="mx-auto max-w-screen-lg">
            <input
              ref={inputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileUpload}
              id="fileInput"
              maxLength={5}
            />
            <div className=" mt-4 flex flex-col gap-4">
              {/* <h1 className="text-xl">Upload CSV</h1> */}
              <p className="text-sm text-neutral-400">
                <span>
                  To import your products, please download the CSV template and
                  fill in the required fields.
                </span>{' '}
                &nbsp;
                <a
                  className=" inline-block text-sm text-primary "
                  href="https://qrafter-public-assets.s3.ap-southeast-1.amazonaws.com/qrafter-product-import-template.csv"
                >
                  <span className="underline">Download CSV Template</span>{' '}
                  <ArrowDownOnSquareIcon className="inline  h-4 w-4 text-primary" />
                </a>
              </p>
              <p className="text-sm text-neutral-400">
                <span>
                  For more a detailed instruction on how to import your
                  products, please
                </span>{' '}
                <a
                  onClick={() => setShowGuide(true)}
                  className=" inline-block text-sm text-primary "
                >
                  <span className="underline">Click Here</span>{' '}
                  <InformationCircleIcon className="inline  h-4 w-4 text-primary" />
                </a>
              </p>
              <button
                className="btn mx-auto mt-10 flex h-60 w-80 flex-col items-center justify-center border-4 border-dashed border-neutral-400 bg-transparent"
                onClick={onUploadClick}
              >
                <div className="flex flex-col items-center justify-center gap-3 text-center">
                  <CloudArrowUpIcon className="w-20 text-secondary" />
                  <p className="text-neutral-400">
                    Click to upload your CSV file
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}
        {parsedData && (
          <Formik
            initialValues={{
              products: parsedData,
            }}
            onSubmit={async (values) => {
              console.log('Form Values:', values)
              await importProducts({ products: values.products })
              navigate('/products')
            }}
            validateOnMount={true}
            enableReinitialize={true}
          >
            {({ values, validateForm, submitForm }) => (
              <div className="">
                <div className=" flex flex-col gap-4 ">
                  <div className="flex w-full flex-row items-center justify-between gap-4">
                    <p className="inline-block text-lg">Preview</p>
                    <button
                      className="btn btn-sm"
                      onClick={() => {
                        setParsedData(null)
                        setErrorRows([])
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                  <a
                    onClick={() => setShowGuide(true)}
                    className=" inline-block text-sm text-primary "
                  >
                    <span className="underline">Column Guide</span>
                    <InformationCircleIcon className="inline  h-4 w-4 text-primary" />
                  </a>
                  <div>
                    <p className="text-base">
                      Product to be imported: {values.products.length}
                    </p>
                    {errorRows.length > 0 && (
                      <p className="text-sm">
                        Invalid Rows:{' '}
                        <span className="text-red-400">{errorRows.length}</span>
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <FieldArray
                    name="products"
                    render={({ remove, name }) => (
                      <>
                        {values.products.map((data, index) => {
                          const key = `${name}.${index}`
                          return (
                            <div
                              key={`${data.name}-${data.id}`}
                              className={`flex flex-row  justify-center gap-2 [&:has(.form-field-error)]:bg-red-100  ${
                                errorRows.includes(toNumber(data.id))
                                  ? 'bg-red-100'
                                  : ''
                              }`}
                            >
                              <button
                                className="btn btn-ghost btn-sm mt-3"
                                onClick={() => {
                                  remove(index)
                                }}
                              >
                                <TrashIcon className="w-5 text-red-400" />
                              </button>
                              <div className="collapse collapse-arrow ">
                                <input type="checkbox" className="peer" />
                                <div className="collapse-title font-medium">
                                  <p className="text-xs">Row: {data.id}</p>
                                  <h1>{data.name}</h1>
                                </div>
                                <div className="collapse-content flex flex-col gap-2">
                                  <div className="">
                                    <Field
                                      name={`${key}.name`}
                                      validate={(value: string) => {
                                        const validation = z
                                          .string({
                                            required_error: 'Name is required',
                                          })
                                          .min(1, 'Name is required')
                                          .safeParse(value)
                                        if (validation.success === false) {
                                          return validation.error.issues[0]
                                            .message
                                        }

                                        return null
                                      }}
                                    >
                                      {({ field, meta }: FieldProps) => (
                                        <label className="form-control w-full ">
                                          <div className="">
                                            <span className="label-text-alt text-gray-400">
                                              Product Name
                                            </span>
                                          </div>
                                          <input
                                            {...field}
                                            disabled={isImporting}
                                            autoComplete="off"
                                            type="text"
                                            placeholder="(e.g., Milk Tea, Coffee, etc.)"
                                            className="input input-bordered input-sm w-full !text-base"
                                            tabIndex={1}
                                          />

                                          {meta.error && (
                                            <div className="form-field-error label py-0">
                                              <span className="label-text-alt text-xs text-red-400">
                                                {meta.error}
                                              </span>
                                            </div>
                                          )}
                                        </label>
                                      )}
                                    </Field>
                                    <Field
                                      name={`${key}.cost`}
                                      validate={(value: string) => {
                                        if (value === '') {
                                          return 'Cost is required'
                                        }
                                        const validation = z
                                          .number({
                                            required_error: 'Cost is required',
                                            invalid_type_error:
                                              'Cost must be a number',
                                          })
                                          .nonnegative(
                                            'Cost must be a positive number',
                                          )
                                          .safeParse(toNumber(value))
                                        if (validation.success === false) {
                                          console.log(
                                            validation.error.issues[0].message,
                                          )
                                          return validation.error.issues[0]
                                            .message
                                        }
                                        return null
                                      }}
                                    >
                                      {({ field, form, meta }: FieldProps) => (
                                        <label className="form-control">
                                          <div className="">
                                            <span className="label-text-alt text-gray-400">
                                              Cost
                                            </span>
                                          </div>
                                          <CurrencyInput
                                            disabled={isImporting}
                                            autoComplete="off"
                                            decimalsLimit={4}
                                            prefix="₱"
                                            type="text"
                                            tabIndex={2}
                                            className="input input-bordered input-sm w-full !text-base"
                                            placeholder="₱0"
                                            inputMode="decimal"
                                            value={field.value}
                                            onValueChange={async (value) => {
                                              form.setFieldValue(
                                                field.name,
                                                value ?? '',
                                              )
                                            }}
                                          />
                                          {meta.error && (
                                            <div className="form-field-error label py-0">
                                              <span className="label-text-alt text-xs text-red-400">
                                                {meta.error}
                                              </span>
                                            </div>
                                          )}
                                        </label>
                                      )}
                                    </Field>
                                    <Field
                                      name={`${key}.price`}
                                      validate={(value: string) => {
                                        if (value === '') {
                                          return 'Price is required'
                                        }
                                        const validation = z
                                          .number({
                                            required_error: 'Cost is required',
                                            invalid_type_error:
                                              'Price must be a number',
                                          })
                                          .nonnegative(
                                            'Price must be a positive number',
                                          )
                                          .safeParse(toNumber(value))
                                        if (validation.success === false) {
                                          console.log(
                                            validation.error.issues[0].message,
                                          )
                                          return validation.error.issues[0]
                                            .message
                                        }
                                        return null
                                      }}
                                    >
                                      {({ field, form, meta }: FieldProps) => (
                                        <label className="form-control">
                                          <div className="">
                                            <span className="label-text-alt text-gray-400">
                                              Price
                                            </span>
                                          </div>
                                          <CurrencyInput
                                            disabled={isImporting}
                                            autoComplete="off"
                                            decimalsLimit={4}
                                            prefix="₱"
                                            type="text"
                                            tabIndex={2}
                                            className="input input-bordered input-sm w-full !text-base"
                                            placeholder="₱0"
                                            inputMode="decimal"
                                            value={field.value}
                                            onValueChange={async (value) => {
                                              form.setFieldValue(
                                                field.name,
                                                value ?? '',
                                              )
                                            }}
                                          />
                                          {meta.error && (
                                            <div className="form-field-error label py-0">
                                              <span className="label-text-alt text-xs text-red-400">
                                                {meta.error}
                                              </span>
                                            </div>
                                          )}
                                        </label>
                                      )}
                                    </Field>
                                    <label className="form-control w-full ">
                                      <div className="">
                                        <span className="label-text-alt text-gray-400">
                                          Unit of measurement
                                        </span>
                                      </div>
                                      <Field
                                        name={`${key}.unitOfMeasurement`}
                                        validate={(value: string) => {
                                          if (value === '') {
                                            return 'Unit of Measurement is required'
                                          }

                                          return null
                                        }}
                                      >
                                        {({ field, form }: FieldProps) => (
                                          <div className="-mt-2">
                                            <MeasurementSelect
                                              disabled={isImporting}
                                              measurements={[
                                                'mass',
                                                'volume',
                                                'pieces',
                                              ]}
                                              className="Import_MeasurementSelect !input-sm !text-base"
                                              value={getMeasurementOptionsValue(
                                                field.value,
                                              )}
                                              onChange={(value) => {
                                                if (!value) {
                                                  return
                                                }
                                                form.setFieldValue(
                                                  field.name,
                                                  value?.value,
                                                )
                                              }}
                                            />
                                          </div>
                                        )}
                                      </Field>
                                    </label>
                                    <Field
                                      name={`${key}.quantity`}
                                      validate={(value: string) => {
                                        if (value === '') {
                                          return 'Quantity is required'
                                        }
                                        const validation = z
                                          .number({
                                            required_error:
                                              'Quantity is required',
                                          })
                                          .nonnegative(
                                            'Quantity must be a positive number',
                                          )
                                          .safeParse(toNumber(value))
                                        if (validation.success === false) {
                                          console.log(
                                            validation.error.issues[0].message,
                                          )
                                          return validation.error.issues[0]
                                            .message
                                        }
                                        return null
                                      }}
                                    >
                                      {({ field, form, meta }: FieldProps) => (
                                        <label className="form-control mt-2">
                                          <div className="">
                                            <span className="label-text-alt text-gray-400">
                                              Quantity
                                            </span>
                                          </div>
                                          <CurrencyInput
                                            disabled={isImporting}
                                            autoComplete="off"
                                            decimalsLimit={4}
                                            type="text"
                                            tabIndex={3}
                                            className="input input-bordered input-sm w-full !text-base"
                                            placeholder="Enter Batch Quantity"
                                            inputMode="decimal"
                                            value={field.value}
                                            onValueChange={async (value) => {
                                              form.setFieldValue(
                                                field.name,
                                                value ?? '',
                                              )
                                            }}
                                          />
                                          {meta.error && (
                                            <div className="form-field-error label py-0">
                                              <span className="label-text-alt text-xs text-red-400">
                                                {meta.error}
                                              </span>
                                            </div>
                                          )}
                                        </label>
                                      )}
                                    </Field>
                                    <Field
                                      name={`${key}.expiration`}
                                      validate={(value: string) => {
                                        if (value) {
                                          console.log(value)
                                          // validate date using moment. The format is YYYY-MM-DD
                                          const validation = z
                                            .string({
                                              required_error:
                                                'Expiration is required',
                                            })
                                            .regex(
                                              /^\d{4}-\d{2}-\d{2}$/,
                                              'Required format: YYYY-MM-DD',
                                            )
                                            .optional()
                                            .safeParse(value)
                                          if (validation.success === false) {
                                            return validation.error.issues[0]
                                              .message
                                          }
                                        }

                                        return null
                                      }}
                                    >
                                      {({ field, meta, form }: FieldProps) => (
                                        <label className="form-control w-full ">
                                          <div className="">
                                            <span className="label-text-alt text-gray-400">
                                              Expiration
                                            </span>
                                          </div>
                                          <div className="flex flex-row gap-2">
                                            <input
                                              {...field}
                                              disabled={isImporting}
                                              autoComplete="off"
                                              type="text"
                                              className="input input-bordered input-sm w-full !text-base"
                                              tabIndex={1}
                                              value={field.value}
                                            />
                                            <button
                                              disabled={isImporting}
                                              className="btn btn-sm"
                                              onClick={() => {
                                                form.setFieldValue(
                                                  field.name,
                                                  '',
                                                )
                                              }}
                                            >
                                              <XMarkIcon className="w-4" />
                                            </button>
                                          </div>

                                          {meta.error && (
                                            <div className="form-field-error label py-0">
                                              <span className="label-text-alt text-xs text-red-400">
                                                {meta.error}
                                              </span>
                                            </div>
                                          )}
                                        </label>
                                      )}
                                    </Field>
                                    <Field
                                      name={`${key}.allowBackOrder`}
                                      validate={(value: string) => {
                                        if (value) {
                                          // validate date using. Should be Y or N only
                                          const validation = z
                                            .enum(['Y', 'N'], {
                                              invalid_type_error: 'Y or N only',
                                            })
                                            .safeParse(value)

                                          if (validation.success === false) {
                                            return validation.error.issues[0]
                                              .message
                                          }
                                        }

                                        return null
                                      }}
                                    >
                                      {({ field, meta, form }: FieldProps) => (
                                        <label className="form-control w-full ">
                                          <div className="">
                                            <span className="label-text-alt text-gray-400">
                                              Allow Back Order
                                            </span>
                                          </div>
                                          <select
                                            {...field}
                                            disabled={isImporting}
                                            className="select select-bordered select-sm w-full !text-base"
                                            tabIndex={1}
                                          >
                                            <option value="Y">Yes</option>
                                            <option value="N">No</option>
                                          </select>

                                          {meta.error && (
                                            <div className="form-field-error label py-0">
                                              <span className="label-text-alt text-xs text-red-400">
                                                {meta.error}
                                              </span>
                                            </div>
                                          )}
                                        </label>
                                      )}
                                    </Field>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </>
                    )}
                  />
                </div>
                <div className="mt-4 w-full">
                  <button
                    disabled={isImporting}
                    className="btn btn-primary w-full"
                    onClick={async () => {
                      const errors = await validateForm()
                      console.log('Errors:', errors)
                      if (errors.products) {
                        toast.error(
                          'Please ensure there are no invalid rows before importing',
                        )
                      }
                      submitForm()
                    }}
                  >
                    Import Products
                  </button>
                </div>
              </div>
            )}
          </Formik>
        )}
      </div>
    </>
  )
}

export default Import
