const express = require('express')
const router = express.Router()
const supabase = require('../supabase')

//GET all open requests 
router.get('/', async (req, res) =>{
    const{ data, error } = await supabase
    .from('service_requests')
    .select('*')
    .eq('status','open')
    .order('created_at', {ascending: false})
 if(error) return res.status(500).json({ message: error.message })
    res.json(data)
})

//GET request by user
router.get('/user/:userId', async (req, res)=>{
    const { userId } = req.params
    const { data, error} = await supabase
      .from('service_requests')
      .select('*')
      .eq('customer_id', userId)
      .order('created_at', { ascending: false })
    if(error) return res.status(500).json({ message: error.message })
        res.json(data)
})

//POST create new request
router.post('/', async (req, res)=>{
    const { customer_id, title, description, category, location_name } = req.body  
    const { data, error } = await supabase
    .from('service_requests')
    .insert({ customer_id, title, description, category, location_name })
  if (error) return res.status(500).json({ message: error.message })
    res.json(data)
})

module.exports = router