import BlogWrapper1 from '@/views/blog/structure1'
import api from '@/utils/api'

// ✅ Fetch Blogs on Server Component
const BlogPage = async () => {
  try {
    const response = await api.get('/blogs')
    const result = response.data.result

    return <BlogWrapper1 blogs={result.blogs} /> // ✅ Pass `blogs` to `BlogWrapper1`
  } catch (error) {
    return <BlogWrapper1 blogs={[]} /> // ✅ Return empty array on error
  }
}

export default BlogPage
