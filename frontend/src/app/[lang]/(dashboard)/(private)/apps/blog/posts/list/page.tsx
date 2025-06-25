// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import BlogListTable from '@views/apps/content-management/blogs/list/ProductListTable'
import BlogCard from '@views/apps/content-management/blogs/list/ProductCard'

const eCommerceProductsList = async () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <BlogCard />
      </Grid>
      <Grid item xs={12}>
        <BlogListTable />
      </Grid>
    </Grid>
  )
}

export default eCommerceProductsList
