const express = require('express')
const router = express.Router()
const supabase = require('../supabase')
const { verifyToken } = require('../middleware/auth')

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
router.get('/user/:userId', verifyToken, async (req, res)=>{
    const { userId } = req.params
    if (req.user.id !== userId) return res.status(403).json({ message: 'Access denied' })
    const { data, error} = await supabase
      .from('service_requests')
      .select('*')
      .eq('customer_id', userId)
      .order('created_at', { ascending: false })
    if(error) return res.status(500).json({ message: error.message })
        res.json(data)
})

//POST create new request
router.post('/', verifyToken, async (req, res)=>{
    const { customer_id, title, description, category, location_name, latitude, longitude } = req.body  
    const { data, error } = await supabase
    .from('service_requests')
    .insert({ customer_id, title, description, category, location_name, latitude, longitude })
  if (error) return res.status(500).json({ message: error.message })
    res.json(data)
})

//PATCH update status
router.patch('/:id/status', verifyToken, async (req, res)=>{
  const { id } = req.params
  const { status } = req.body
  const { error } = await supabase
    .from('service_requests')
    .update({ status })
    .eq('id', id)
  if(error) return res.status(500).json({ message: error.message })
    res.json({ message: 'Status Updated'})
})

//PATCH update the request content
router.patch('/:id', verifyToken, async (req, res)=>{
  const {id} = req.params
  const { data: sr, error: fetchError } = await supabase
      .from('service_requests').select('customer_id').eq('id', id).single()
  if (fetchError || !sr) return res.status(404).json({ message: 'Request not found' })
  if (req.user.id !== sr.customer_id) return res.status(403).json({ message: 'Access denied' })
  const { title, category, description, location_name, latitude, longitude } = req.body
  const { error } = await supabase
   .from('service_requests')
   .update({ title, category, description, location_name})
   .eq('id', id)
  if(error) return res.status(500).json({ message: error.message})
    res.json({ message: 'Request updated'})
  })



//DELETE request
router.delete('/:id', verifyToken, async (req, res)=>{
  const{ id } = req.params
  const { data: sr, error: fetchError } = await supabase
      .from('service_requests').select('customer_id').eq('id', id).single()
  if (fetchError || !sr) return res.status(404).json({ message: 'Request not found' })
  if (req.user.id !== sr.customer_id) return res.status(403).json({ message: 'Access denied' })
  const { error } = await supabase
    .from('service_requests')
    .delete()
    .eq('id', id)
  if(error) return res.status(500).json({ message: error.message})
    res.json({ message: 'Request deleted'})
})
module.exports = router