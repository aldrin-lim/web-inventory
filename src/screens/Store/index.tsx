import Toolbar from 'components/Layout/components/Toolbar'
import { ArrowSmallLeftIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import { AppPath } from 'routes/AppRoutes.types'
import { useEffect, useState } from 'react'
import useUser from 'hooks/useUser'
import { updateUserBussiness } from 'api/users.api'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'react-toastify'

const Store = () => {
  const navigate = useNavigate()
  const { user, isLoading } = useUser()
  const [businessName, setBusinessName] = useState('')

  const business = user?.businesses[0]

  const { mutateAsync, isLoading: isMutating } = useMutation({
    mutationFn: updateUserBussiness,
    onError: (error) => {
      let errorMessage = "We're sorry, we've encountered an issue. "
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
          errorMessage = error.response?.data?.message
        }
      }
      toast.error(errorMessage, {
        autoClose: 3000,
        theme: 'colored',
      })
    },
  })

  useEffect(() => {
    const business = user?.businesses[0]
    if (business) {
      setBusinessName(business.name)
    }
  }, [user])

  const onSaveHandler = async () => {
    if (business) {
      await mutateAsync({ id: business.id, name: businessName })
    }
  }

  return (
    <div className="section w-full pt-0">
      <Toolbar
        items={[
          <label
            key="12"
            className="btn btn-square btn-ghost drawer-button -ml-4"
            onClick={() => navigate(AppPath.Settings)}
          >
            <ArrowSmallLeftIcon className="w-6 text-blue-400" />
          </label>,
        ]}
      />
      <h1>Store</h1>
      {isLoading && (
        <div className="mt-3 flex flex-col gap-2">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text text-xs">Store name</span>
            </label>
            <div className="skeleton h-[48px] w-full rounded-md" />
          </div>
          <div className="skeleton mt-4 h-[48px] w-full rounded-md" />
        </div>
      )}
      {!isLoading && (
        <div className="mt-3 flex flex-col gap-2">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text text-xs">Store name</span>
            </label>
            <input
              disabled={isMutating}
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              type="text"
              className="input input-bordered w-full"
            />
          </div>
          <button
            disabled={isMutating}
            onClick={onSaveHandler}
            className="btn btn-primary btn-active mt-4 w-auto"
          >
            Save
          </button>
        </div>
      )}
      {/* <div className="mt-3 flex flex-col gap-2">
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text text-xs">Store name</span>
          </label>
          <input type="text" className="input input-bordered w-full" />
        </div>
        <button
          onClick={onSaveHandler}
          className="btn btn-primary btn-active mt-4 w-auto"
        >
          Save
        </button>
      </div> */}
    </div>
  )
}

export default Store
