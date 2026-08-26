const express = require('express')
const router = express.Router()
const supabase = require('../supabase')

//Get responses by provider
router.get('/provider/:providerId', async (req, res)=>{
    const {providerId} = req.params
    const { data, error } = await supabase
      .from('request_responses')
      .select('*, service_requests(*)')
      .eq('provider_id', providerId)
      .order('created_at', {ascending: false})
    if(error)return res.status(500).json({ message: error.message })
    res.json(data)
})

//Post create a responses to a request
router.post('/', async (req, res)=>{
     const { request_id, provider_id, message } = req.body
     const { data, error } = await supabase
      .from('request_responses')
      .insert({ request_id, provider_id, message })
    if (error) return res.status(500).json({ message: error.message })
    res.json(data)
    })

    module.exports = router