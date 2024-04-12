import useDeleteBatch from 'hooks/useDeleteBatch'
import { ProductFormValues } from 'screens/Product/hooks/useProductFormValue'

type AdjustmentDialogProps = {
  onClose?: () => void
  onSave?: () => void
  batch: ProductFormValues['batches'][number]
  productId: string
}

const DeleteBatchDialog = (props: AdjustmentDialogProps) => {
  const { onClose, batch, productId } = props
  const { isLoading, deleteBatch, error } = useDeleteBatch()

  const onDeleteBatch = async () => {
    await deleteBatch({ batchId: batch.id, productId: productId })
    onClose?.()
  }

  return (
    <dialog open={true} className="modal bg-black/30">
      <div className="modal-box px-4">
        <div className="mt-4 flex flex-col gap-3">
          <h3 className="text-lg ">
            Delete <strong>{batch.name} </strong> Permanently? This action
            cannot be undone
          </h3>
          <div className="form-field-error label py-0">
            <span className="label-text-alt text-xs text-red-400">
              {error?.toString()}
            </span>
          </div>
        </div>
        <div className="font-sm modal-action">
          <button disabled={isLoading} onClick={onClose} className="btn">
            Cancel
          </button>
          <button
            disabled={isLoading}
            onClick={onDeleteBatch}
            type="button"
            className="btn btn-primary"
          >
            Delete
          </button>
        </div>
      </div>
    </dialog>
  )
}

export default DeleteBatchDialog
