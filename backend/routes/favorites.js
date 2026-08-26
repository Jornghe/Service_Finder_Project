const express = require('express')
const router = express.Router()
const supabase = require('../supabase')

//Get all favorite for a user
router.get('/:userId', async(req, res)=>{
    const {userId} = req.params
    const { data, error } = await supabase
      .from('favorites')
      .select('*, services(*)')
      .eq('user_id', userId)
    if(error) return res.status(500).json({ message: error.message })
        res.json(data)
})

//Post add a favorite
router.post('/', async(req, res)=>{
    const { user_id, service_id } = req.body
    const { data, error } = await supabase
       .from('favorites')
       .insert({ user_id, service_id})
    if(error) return res.status(500).json({ message: error.message })
        res.json(data)
})

//Delete remove a favorite
router.delete('/', async (req, res)=>{
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