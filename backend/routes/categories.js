const express = require('express')
const router = express.Router()
const supabase = require('../supabase')

router.get('/all', async (req,res)=>{
    const { data, error} = await supabase
    .from('categories')
    .select('*')
    .neq('name', 'All')

    if (error) return res.status(500).json({ message: error.message})
        res.json(data)
})

module.exports = router