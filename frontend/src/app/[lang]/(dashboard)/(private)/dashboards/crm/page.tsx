// MUI Imports
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

const DashboardCRM = async () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start', // move to top
        justifyContent: 'center',
        minHeight: '100vh',
        pt: 20, // add padding top to control how high you want it
        textAlign: 'center',
        px: 4
      }}
    >
      <Box sx={{ maxWidth: 600 }}>
        <Typography variant='h4' color='secondary.main'>
          Welcome! Please check the navigation menu to manage Blog and Help Center items.
        </Typography>
      </Box>
    </Box>
  )
}

export default DashboardCRM
