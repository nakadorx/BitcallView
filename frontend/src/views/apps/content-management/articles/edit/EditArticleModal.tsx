import { Dialog, DialogTitle, DialogContent } from '@mui/material'
import ProductInformation from '../add/ProductInformation'

interface EditBlogModalProps {
  open: boolean
  onClose: () => void
  initData: any
}

const EditArticleModal = ({ open, onClose, initData }: any) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='lg'>
      <DialogTitle>Update Article</DialogTitle>
      <DialogContent>
        <ProductInformation initData={initData} />
      </DialogContent>
    </Dialog>
  )
}

export default EditArticleModal
