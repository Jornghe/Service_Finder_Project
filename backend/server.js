require('dotenv').config()
const express = require('express')
const cors = require('cors')


const authRoutes = require('./routes/auth')
const serviceRoutes = require('./routes/services')
const categoriesRoutes = require('./routes/categories')
const reviewsRoutes = require('./routes/reviews')
const favoritesRoutes = require('./routes/favorites')
const requestsRoutes = require('./routes/requests')
const chatRoutes = require('./routes/chat')
const responsesRoutes = require('./routes/responses')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)

app.use ('/api/services', serviceRoutes)

app.use('/api/categories', categoriesRoutes)

app.use('/api/reviews', reviewsRoutes)

app.use('/api/favorites', favoritesRoutes )

app.use('/api/requests', requestsRoutes)

app.use('/api/chat', chatRoutes)

app.use('/api/responses', responsesRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`)
})

