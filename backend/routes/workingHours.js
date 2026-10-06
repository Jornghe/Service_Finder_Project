const express = require('express')
const router = express.Router()
const supabase = require('../supabase')
const { verifyToken } = require('../middleware/auth')

// POST save working hours for a service
router.post('/', verifyToken, async (req, res) => {
    const { service_id, day, is_open, open_time, close_time } = req.body
    const { error } = await supabase
        .from('working_hours')
        .insert({ service_id, day, is_open, open_time, close_time })
    if (error) return res.status(500).json({ message: error.message })
    res.json({ message: 'Working hours saved' })
})

// GET working hours for a service
router.get('/:serviceId', async (req, res) => {
    const { serviceId } = req.params
    const { data, error } = await supabase
        .from('working_hours')
        .select('*')
        .eq('service_id', serviceId)
        .order('day')
    if (error) return res.status(500).json({ message: error.message })
    res.json(data)
})

module.exports = router
