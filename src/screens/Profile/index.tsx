import Toolbar from 'components/Layout/components/Toolbar'
import { Bars3Icon, ChevronLeftIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import useUser from 'hooks/useUser'
import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { updateUser } from 'api/users.api'
import { AppPath } from 'routes/AppRoutes.types'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import { toast } from 'react-toastify'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import { Analytics } from 'util/analytics'

const Profile = () => {
  const navigate = useNavigate()
  const { user, isLoading: isUserLoading } = useUser()
  useEffect(() => {
    Analytics.trackPageView('Profile')
  }, [])

  // TODO: Remove this
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  const [name, setName] = useState('')

  const { mutateAsync, isLoading: isMutating } = useMutation({
    mutationFn: updateUser,
    onSuccess: async () => {
      toast.success('Profile Updated ', {
        autoClose: 500,
        theme: 'colored',
      })
    },
    onError: () => {
      toast.error('Profile Update Failed ', {
        autoClose: 500,
        theme: 'colored',
      })
    },
  })

  useEffect(() => {
    setName(user?.name || '')
  }, [user])

  const onSaveHandler = async () => {
    await mutateAsync({ name })
  }

  return (
    <div className="screen">
      <Toolbar
        start={
          <label
            htmlFor="my-drawer"
            className="btn btn-link px-0 normal-case text-blue-400 no-underline disabled:bg-transparent disabled:text-gray-400"
          >
            <Bars3Icon className="w-6" />
          </label>
        }
        middle={<ToolbarTitle title="User Profile" />}
      />
      <div className="mt-3 flex flex-col gap-2">
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text text-xs">Email</span>
          </label>
          {isUserLoading ? (
            <div className="skeleton h-[48px] w-full" />
          ) : (
            <input
              type="text"
              className="input input-bordered w-full"
              disabled
              defaultValue={user?.email}
            />
          )}
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text text-xs">Name</span>
          </label>
          {isUserLoading ? (
            <div className="skeleton h-[48px] w-full" />
          ) : (
            <input
              type="text"
              className="input input-bordered w-full"
              disabled={isMutating}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
        </div>
        <button
          className="btn btn-primary btn-active mt-4 w-auto"
          disabled={isMutating}
          onClick={onSaveHandler}
        >
          {isMutating && <span className="loading loading-spinner"></span>}
          Save
        </button>
      </div>
    </div>
  )
}

export default Profile
