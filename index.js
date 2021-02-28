// Bring your own HTTP! This makes it easier to add SSL and allows the user to
// choose between different HTTP implementations, such as HTTP/2.
const http = require('http')
const fortune = require('fortune')
const fortuneHTTP = require('fortune-http')
const PORT = process.env.PORT || 5000

const store = fortune({
  user: {
    name: String,

    // Following and followers are inversely related (many-to-many).
    following: [ Array('user'), 'followers' ],
    followers: [ Array('user'), 'following' ],

    // Many-to-one relationship of user posts to post author.
    posts: [ Array('post'), 'author' ]
  },
  post: {
    message: String,

    // One-to-many relationship of post author to user posts.
    author: [ 'user', 'posts' ]
  }
})

// The `fortuneHTTP` function returns a listener function which does
// content negotiation, and maps the internal response to a HTTP response.
const listener = fortuneHTTP(store)
const server = http.createServer((request, response) =>
  listener(request, response)
  .catch(error => { /* error logging */ }))

store.connect().then(() => server.listen(PORT, () => { console.log(`Listening on ${PORT}`)}))
