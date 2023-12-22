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
import StoreDetail from './StoreDetail'

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
    <div className="w-full">
      <StoreDetail />
    </div>
  )
}

export default Store
