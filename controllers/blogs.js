const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router() 
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {username: 1, name: 1, id: 1})
    response.json(blogs.map(blog => blog.toJSON()))
  })
  
  /*const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      return authorization.substring(7)
    }
    return null
  }*/
  

  blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
    const body = request.body
    /*const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)*/
    const user = request.user

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes === undefined ? 0 : body.likes,
      user: user._id
    })
    if (body.title === undefined || body.url === undefined) {
      response.status(400).end()
    } else {
      const savedBlog = await blog.save()
      user.blogs = user.blogs.concat(savedBlog._id)
      await user.save()
      response.json(savedBlog.toJSON())
    }

  })

  blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
    const blogi = await Blog.findById(request.params.id)
    /*const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)*/
    const user = request.user
    if (blogi.user.toString() === user.id.toString()) {
      await Blog.findByIdAndRemove(request.params.id)
      response.status(204).end()
    } else {
      response.status(401).json({error: 'Wrong user'})
    }
    
  })

  blogsRouter.put('/:id', async (request, response) => {
    const body = request.body

    const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog)
    response.json(updatedBlog.toJSON())
  })

  module.exports = blogsRouter