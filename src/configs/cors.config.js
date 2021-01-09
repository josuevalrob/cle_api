const cors = require('cors')

module.exports = cors({
  credentials: true,
  origin: (origin, callback) => {
    if (process.env.ALLOW_ORIGINS === origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
})