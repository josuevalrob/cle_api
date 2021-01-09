const cors = require('cors')

module.exports = cors({
  credentials: true,
  // origin: 'http://localhost:3000'
  origin: (origin, callback) => {
    // ALLOW_ORIGINS = http://localhost:3000,http://localhost:8000
    var whitelist = process.env.ALLOW_ORIGINS.split(',')
    console.log(whitelist, origin, '🎉')
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
})