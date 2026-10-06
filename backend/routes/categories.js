const express = require('express')
const router = express.Router()
const supabase = require('../supabase')
const { verifyToken, requireAdmin } = require('../middleware/auth')

router.get('/all', async (req,res)=>{
    const { data, error} = await supabase
    .from('categories')
    .select('*')
    .neq('name', 'All')

    if (error) return res.status(500).json({ message: error.message})
        res.json(data)
})

router.post('/', verifyToken, requireAdmin, async (req, res) => {
    const { name } = req.body
    if (!name || !name.trim()) return res.status(400).json({ message: 'Category name is required' })
    const { data, error } = await supabase
        .from('categories')
        .insert({ name: name.trim() })
        .select()
        .single()
    if (error) return res.status(500).json({ message: error.message })
    res.json(data)
})

module.exports = router