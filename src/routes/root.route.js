import express from 'express'
const router = express.Router();
router.get('/', (req, res) => {
    res.send('Building Site')
})

export default router