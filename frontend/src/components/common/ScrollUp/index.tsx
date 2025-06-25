import Button from '@mui/material/Button'
import ScrollToTop from '@core/components/scroll-to-top'

// TODO: Update this comp
export const ScrollUp = () => (
  <ScrollToTop className='mui-fixed'>
    <Button variant='contained' className='is-10 bs-10 rounded-full p-0 min-is-0 flex items-center justify-center'>
      <i className='ri-arrow-up-line' />
    </Button>
  </ScrollToTop>
)
