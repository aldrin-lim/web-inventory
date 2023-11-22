import { FaceFrownIcon } from '@heroicons/react/24/outline'

const Error = () => {
  return (
    <div className="z-50 flex h-screen w-screen flex-col items-center justify-center bg-white">
      <FaceFrownIcon className="mx-auto mb-3 w-20" />
      <h1 className="text-3xl font-bold">Unexpected Error</h1>

      <p className="mx-auto mt-10 max-w-xs text-center">
        Sorry, We had some techinical problem. We are already working on it.
        Please try again in a few minutes
      </p>

      <p className="mx-auto mt-10 max-w-xs text-center">
        If you need assitance, contact us at &nbsp;
        <a
          className="underlined text-blue-400"
          href="mailto:support@qrafter.io"
        >
          support@qrafter.io
        </a>
      </p>
    </div>
  )
}

export default Error