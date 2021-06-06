const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const api = supertest(app)

const Blog = require('../models/blog')
const blogsRouter = require('../controllers/blogs')

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('id is defined', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
})

test('blogs can be added to the list', async() => {
    const newBlog = {
        title: 'test blog',
        author: 'testaaja',
        url: 'testaa.fi',
        likes: 1
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDB()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).toContain('test blog')
})

test('if like count is not given set likes to 0', async () => {
    const newBlog = {
        title: 'ilman likei',
        author: 'testaaja',
        url: 'testi.com'
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    
    const blogsAtEnd = await helper.blogsInDB()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    expect(blogsAtEnd[2].likes).toBe(0)
})

test('if title and url are missing blog is not added', async () => {
    const newBlog = {
        author: 'anonymous',
        likes: 100
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    
    const blogsAtEnd = await helper.blogsInDB()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
})

test('blogs can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDB()
    const blogToDelete = blogsAtStart[0]
    
    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)
    
    const blogsAtEnd = await helper.blogsInDB()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).not.toContain(blogToDelete.title)
})

afterAll(() => {
  mongoose.connection.close()
})