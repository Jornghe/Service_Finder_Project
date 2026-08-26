const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const supabase = require('../supabase')

//Register
router.post('/register', async (req, res) =>{
 const { name, email, phone, password } = req.body


if(!name || !email || !phone || !password){
    return res.status(400).json({message: 'All fields are required'})
}  

const password_hash = await bcrypt.hash(password, 10)

const { data, error} = await supabase
.from('users')
.insert([{ name, email, phone, password_hash }])
.select()
.single()

if (error) return res.status(400).json({message: error.message })

const token = jwt.sign({ id: data.id, email: data.email}, process.env.JWT_SECRET, { expiresIn: '7d'} )

res.json({ token, user:{ id: data.id, name: data.name, email: data.email, is_admin: data.is_admin }} )

})

//Login
router.post('/login', async (req, res) =>{
    const { email, password } = req.body

    if(!email || !password){
        return res.status(400).json({ message: 'Email and password are required'})
    }

    const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email',email)
    .single()

    if (error || !user) return res.status(401).json({ message: 'Invalid email or password'})
    
    const match = await bcrypt.compare(password, user.password_hash)
    if(!match) return res.status(401).json({ message: 'Invalid email or password'})

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d'})
    res.json({ token, user: {id: user.id, name: user.name, email: user.email, is_admin: user.is_admin} })
})

module.exports = router