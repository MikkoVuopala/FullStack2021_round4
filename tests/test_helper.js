const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: 'Tämä on testauksen ensimmainen blogi',
        author: 'Testin Tekijä',
        url: 'www.testi.finland',
        likes: 98
    },
    {
        title: 'Alustusta',
        author: 'Gonahdus kuningas',
        url: 'voevoe.fi',
        likes: 3
    }
]

const nonExistingBlog = async () => {
    const blog = new Blog({title: 'removed', author: 'nobody', url: 'nourl.fi', likes: 0})
    await blog.save()
    await blog.remove()
    return blog._id.toString()
}

const blogsInDB = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJson())
}

module.exports = {
    initialBlogs, nonExistingBlog, blogsInDB
}