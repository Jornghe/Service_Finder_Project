const express = require('express')
const router = express.Router()
const supabase = require('../supabase')
const { verifyToken } = require('../middleware/auth')

//Get all favorite for a user
router.get('/:userId', verifyToken, async(req, res)=>{
    const {userId} = req.params
    if (req.user.id !== userId) return res.status(403).json({ message: 'Access denied' })
    const { data, error } = await supabase
      .from('favorites')
      .select('*, services(*, working_hours(*))')
      .eq('user_id', userId)
    if(error) return res.status(500).json({ message: error.message })
        res.json(data)
})

//Post add a favorite
router.post('/', verifyToken, async(req, res)=>{
    const { user_id, service_id } = req.body
    const { data, error } = await supabase
       .from('favorites')
       .insert({ user_id, service_id})
    if(error) return res.status(500).json({ message: error.message })
        res.json(data)
})

//Delete remove a favorite
router.delete('/', verifyToken, async (req, res)=>{
    const {user_id, service_id} = req.body
    const { data, error } = await supabase
     .from('favorites')
     .delete()
     .eq('user_id', user_id)
     .eq('service_id', service_id)
    if (error) return res.status(500).json({ message: error.message })
        res.json({ message: 'Removed from favorites'})
})

module.exports = router