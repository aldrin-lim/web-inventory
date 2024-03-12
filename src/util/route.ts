import { useNavigate, useLocation, useResolvedPath } from 'react-router-dom'

export const useCustomRoute = <T extends Record<string, string>>(paths: T) => {
  const path = Object.keys(paths).reduce(
    (acc, key) => {
      acc[key as keyof T] = paths[key]
      return acc
    },
    {} as Record<keyof T, string>,
  )

  const navigate = useNavigate()

  const location = useLocation()

  const resolvedPath = useResolvedPath('')

  const isParentScreen = resolvedPath.pathname === location.pathname

  const currentScreen = location.pathname.replace(
    `${resolvedPath.pathname}/`,
    '',
  ) as T[keyof T]

  const navigateToParent = () => {
    navigate(resolvedPath.pathname)
  }

  return {
    path,
    isParentScreen,
    currentScreen,
    navigateToParent,
  }
}

export function removeLastPath(str: string) {
  // Trim the trailing slash if it exists
  const trimmedStr = str.endsWith('/') ? str.slice(0, -1) : str
  // Split the string into an array of paths
  const paths = trimmedStr.split('/')
  // Remove the last path
  paths.pop()
  // Join the array back into a string with slashes
  return paths.join('/')
}
