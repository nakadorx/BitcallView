// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import ArticlesListTable from '@views/apps/content-management/articles/list/ProductListTable'

const eCommerceProductsList = async () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ArticlesListTable />
      </Grid>
    </Grid>
  )
}

export default eCommerceProductsList
