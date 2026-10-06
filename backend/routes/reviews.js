const express = require('express')
const router = express.Router()
const supabase = require('../supabase')
const { verifyToken } = require('../middleware/auth')

router.get('/user/:userId', async(req, res) =>{
    const { userId } = req.params
    const { data, error } = await supabase
     .from('reviews')
     .select('id')
     .eq('customer_id', userId)
    if(error) return res.status(500).json({ message: error.message})
    res.json(data)
})

router.get('/:serviceId', async(req, res) =>{
    const { serviceId } = req.params
    const { data, error } = await supabase
     .from('reviews')
     .select('* , users(name, avatar_url)')
     .eq('service_id', serviceId)
     .order('created_at', { ascending: false})
   
     if(error) return res.status(500).json({ message: error.message})
    res.json(data)
    
})

router.post('/', verifyToken, async(req, res) =>{
    const { service_id, customer_id, rating, comment } = req.body

    //save review
    const { error } = await supabase
    .from('reviews')
    .insert([{ service_id, customer_id, rating, comment }])

    if (error) return res.status(500).json({ message: error.message })

    //Recalculate the avg review rating and review count
    const { data: allReviews }= await supabase
     .from('reviews')
     .select('rating')
     .eq('service_id', service_id)

     const count = allReviews.length
     const avg = allReviews.reduce((sum, r) => sum + r.rating, 0)/ count 

     await supabase
     .from('services')
     .update({ avg_rating: avg.toFixed(1), review_count: count})
     .eq('id', service_id)

     res.json({ message: 'Review Saved'})
})

module.exports = router