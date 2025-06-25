import { Dialog, DialogTitle, DialogContent } from '@mui/material'
import ProductInformation, { BlogPostData } from '../add/ProductInformation'

interface EditBlogModalProps {
  open: boolean
  onClose: () => void
  initData: BlogPostData
}

const EditBlogModal = ({ open, onClose, initData }: any) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='lg'>
      <DialogTitle>Update Blog Post</DialogTitle>
      <DialogContent>
        <ProductInformation initData={initData} />
      </DialogContent>
    </Dialog>
  )
}

export default EditBlogModal
