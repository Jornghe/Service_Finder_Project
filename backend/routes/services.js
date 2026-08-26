const express = require('express')
const router = express.Router()
const supabase = require('../supabase')

//Get all services
router.get('/', async (req, res) =>{
    const { data, error} = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)

    if(error) return res.status(500).json({ message: error.message })
        res.json(data)
})

//Get nearby Services
router.get('/nearby', async (req, res) =>{
    const { lat, lng, limit = 10} = req.query

    if(!lat || !lng ){
        return res.status(400).json({ message:'lat and long are required'})
    }

    const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .limit(limit)

    if(error) return res.status(500).json({ message: error.message})
        res.json(data)
    
})

//Get single service
router.get('/:slug', async (req, res) =>{
    const {slug} = req.params

    const{ data, error } = await supabase
    .from('services')
    .select('*')
    .eq('slug', slug)
    .single()

    if (error) return res.status(404).json({ message: 'Service not found '})
        res.json(data)
})

module.exports = router
