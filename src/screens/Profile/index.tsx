import Toolbar from 'components/Layout/components/Toolbar'
import {
  ArrowSmallLeftIcon,
  ChevronLeftIcon,
} from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import useUser from 'hooks/useUser'
import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { updateUser } from 'api/users.api'
import { AppPath } from 'routes/AppRoutes.types'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import { toast } from 'react-toastify'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'

const Profile = () => {
  const navigate = useNavigate()
  const { user, isLoading: isUserLoading } = useUser()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

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
    setFirstName(user?.firstName || '')
    setLastName(user?.lastName || '')
  }, [user])

  const onSaveHandler = async () => {
    await mutateAsync({ firstName, lastName })
  }

  return (
    <div className="screen">
      <Toolbar
        items={[
          <ToolbarButton
            key={1}
            icon={<ChevronLeftIcon className="w-6" />}
            onClick={() => navigate(AppPath.Root)}
            disabled={isMutating}
          />,
          <ToolbarTitle key={2} title="User Profile" />,
        ]}
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
            <span className="label-text text-xs">First name</span>
          </label>
          {isUserLoading ? (
            <div className="skeleton h-[48px] w-full" />
          ) : (
            <input
              type="text"
              className="input input-bordered w-full"
              disabled={isMutating}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          )}
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text text-xs">Last name</span>
          </label>
          {isUserLoading ? (
            <div className="skeleton h-[48px] w-full" />
          ) : (
            <input
              type="text"
              disabled={isMutating}
              className="input input-bordered w-full"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
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
