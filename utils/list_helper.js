const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, likes) => {
        return sum + likes.likes
    }
    return blogs.length === 0
        ? 0
        : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    const arr = []
    for (i = 0; i < blogs.length; i++) {
        arr.push(blogs[i].likes)
    }
    const maxLikes = Math.max(...arr)
    const fave = blogs.find(b => b.likes === maxLikes)
    
    return blogs.length === 0
        ? null
        : fave
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}