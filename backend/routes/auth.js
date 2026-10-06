const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const supabase = require('../supabase')
const { verifyToken } = require('../middleware/auth')

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

res.json({ token, user:{ id: data.id, name: data.name, email: data.email, phone: data.phone, is_admin: data.is_admin, is_provider: data.is_provider } })

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
    
    if(user.is_suspend)return res.status(403).json({ message: 'Your account has been suspended. Please contact the support. '})
    const match = await bcrypt.compare(password, user.password_hash)
    if(!match) return res.status(401).json({ message: 'Invalid email or password'})

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d'})
    res.json({ token, user: {id: user.id, name: user.name, email: user.email, phone: user.phone, is_admin: user.is_admin, is_provider: user.is_provider } })
})

//PATCH update user profile
router.patch('/update/:id', verifyToken, async (req, res) =>{
    const { id } = req.params
    if (req.user.id !== id) return res.status(403).json({ message: 'Access denied' })
    const { name, email, phone } = req.body
    const { error } = await supabase
    .from('users')
    .update({ name, email, phone })
    .eq('id', id)

    if (error) return res.status(400).json({ message: error.message })
    res.json({ message: 'Profile updated successfully'})
})

//PATCH set is_provider = true
router.patch('/set-provider/:id', verifyToken, async (req, res) => {
    const { id } = req.params
    if (req.user.id !== id) return res.status(403).json({ message: 'Access denied' })
    const { error } = await supabase.from('users').update({ is_provider: true }).eq('id', id)
    if (error) return res.status(500).json({ message: error.message })
    res.json({ message: 'Provider status updated' })
})

//POST set password for OAuth users (no current password needed)
router.post('/set-password/:id', verifyToken, async (req, res) => {
    const { id } = req.params
    if (req.user.id !== id) return res.status(403).json({ message: 'Access denied' })
    const { newPassword } = req.body
    if (!newPassword) return res.status(400).json({ message: 'Password is required' })

    const password_hash = await bcrypt.hash(newPassword, 10)
    const { error } = await supabase.from('users').update({ password_hash }).eq('id', id)
    if (error) return res.status(500).json({ message: error.message })
    res.json({ message: 'Password set successfully' })
})

//patch Chanage password
router.patch('/change-password/:id', verifyToken, async (req, res) =>{
    const { id } = req.params
    if (req.user.id !== id) return res.status(403).json({ message: 'Access denied' })
    const { currentPassword, newPassword } = req.body

    const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single()
    if(error) return res.status(500).json({ message: error.message })

    const match = await bcrypt.compare(currentPassword, user.password_hash)
    if(!match) return res.status(401).json({ message: 'Current password is incorrect'})

    const password_hash = await bcrypt.hash(newPassword, 10)
    const { error: updateError } = await supabase
    .from('users')
    .update({ password_hash })
    .eq('id', id)

    if(updateError) return res.status(500).json({ message: updateError.message })
    res.json({ message: 'Password changed successfully'})
})


//GET check password type for a user
router.get('/password-type/:id', verifyToken, async (req, res) => {
    const { id } = req.params
    if (req.user.id !== id) return res.status(403).json({ message: 'Access denied' })
    const { data, error } = await supabase.from('users').select('password_hash').eq('id', id).single()
    if (error || !data) return res.status(404).json({ message: 'User not found' })
    res.json({ isGoogleOAuth: data.password_hash === 'google_oauth' })
})

//POST OAuth sync — upsert Google user (bypasses RLS via service role)
router.post('/oauth-sync', async (req, res) => {
    const { id, name, email } = req.body
    if (!id || !email) return res.status(400).json({ message: 'Missing user data' })

    const { data: existing } = await supabase.from('users').select('*').eq('id', id).single()
    if (existing) return res.json(existing)

    const { data: newUser, error } = await supabase
        .from('users')
        .insert({ id, name, email, phone: '', password_hash: 'google_oauth' })
        .select()
        .single()
    if (error) return res.status(500).json({ message: error.message })
    res.json(newUser)
})

//Delete user account
router.delete('/delete/:id', verifyToken, async (req, res) =>{
    const { id } = req.params
    if (req.user.id !== id) return res.status(403).json({ message: 'Access denied' })
    const { Password } = req.body
    const { data: user, error } = await supabase
    .from('users')
    .select('password_hash')
    .eq('id', id)
    .single()
    if(error) return res.status(500).json({ message: error.message })

    const match = await bcrypt.compare(Password, user.password_hash)
    if(!match) return res.status(401).json({ message: 'incorrect password'})

    const { error: deleteError } = await supabase
    .from('users')
    .delete()
    .eq('id', id)
    if(deleteError) return res.status(500).json({ message: deleteError.message })
    res.json({ message: 'Account deleted'})
})

router.get('/check-suspend/:id', async (req, res) => {
    const { id } = req.params
    const { data } = await supabase.from('users').select('is_suspend').eq('id', id).single()
    res.json({ is_suspend: data?.is_suspend || false })
})

module.exports = router