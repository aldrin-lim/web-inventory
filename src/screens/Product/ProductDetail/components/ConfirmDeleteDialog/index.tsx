import { LegacyRef, forwardRef, useState } from 'react'

type ConfirmDeleteDialogProps = {
  onClose?: () => void
  onDelete?: () => void
  productName?: string
}

const ConfirmDeleteDialog = forwardRef(
  (props: ConfirmDeleteDialogProps, ref: LegacyRef<HTMLDialogElement>) => {
    const [isDeleting, setIsDeleting] = useState(false)
    const onDelete = async () => {
      try {
        setIsDeleting(true)

        // Call the onClose prop function if it exists
        if (props.onDelete) {
          await props.onDelete()
        }

        // Close the dialog
        if (ref && typeof ref === 'object' && ref.current) {
          ref.current.close()
        }
      } finally {
        setIsDeleting(false)
      }
    }

    const onClose = () => {
      if (props.onClose) {
        props.onClose()
      }
      if (ref && typeof ref === 'object' && ref.current) {
        ref.current.close()
      }
    }
    return (
      <dialog ref={ref} id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Confirm Action</h3>
          <p className="py-4">
            Are you sure you want to <strong>DELETE</strong> {props.productName}
            ?
          </p>
          <div className="flex w-full flex-col gap-3">
            {/* <form className="flex w-full flex-col gap-3" method="dialog"> */}
            {/* if there is a button in form, it will close the modal */}
            <button
              disabled={isDeleting}
              onClick={onDelete}
              className="btn btn-error w-full text-white"
            >
              Delete product
              {isDeleting && (
                <span className="loading loading-spinner loading-xs" />
              )}
            </button>
            <button
              disabled={isDeleting}
              onClick={onClose}
              className="btn mx-0 w-full"
            >
              Cancel{' '}
            </button>
            {/* </form> */}
          </div>
        </div>
      </dialog>
    )
  },
)

ConfirmDeleteDialog.displayName = 'ConfirmDeleteDialog'

export default ConfirmDeleteDialog
