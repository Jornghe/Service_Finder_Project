const express = require('express')
const router = express.Router()
const supabase = require('../supabase')
const { verifyToken } = require('../middleware/auth')

//GET all conversation for a user
router.get('/conversation/:userId', verifyToken, async (req, res)=>{
    const { userId } = req.params
    if (req.user.id !== userId) return res.status(403).json({ message: 'Access denied' })
    const { data, error } = await supabase
     .from('conversations')
     .select('*, user_one:users!user_one_id(id,name), user_two:users!user_two_id(id,name)')
     .or(`user_one_id.eq.${userId}, user_two_id.eq.${userId}`)
     .order('last_message_at', { ascending: false})
    if(error) return res.status(500).json({ message: error.message })
        res.json(data)
})

//GET messages for a conversation
router.get('/message/:conversationId', verifyToken, async(req,res)=>{
    const { conversationId } = req.params
    const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .select('user_one_id, user_two_id')
        .eq('id', conversationId)
        .single()
    if (convError || !conversation) return res.status(404).json({ message: 'Conversation not found' })
    if (req.user.id !== conversation.user_one_id && req.user.id !== conversation.user_two_id) {
        return res.status(403).json({ message: 'Access denied' })
    }
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
    if(error) return res.status(500).json({ message: error.message })
        res.json(data)
})

//POST create or find a conversation
router.post('/conversation', verifyToken, async (req, res) => {
    const { user_one_id, user_two_id } = req.body
    const { data: existing } = await supabase
        .from('conversations')
        .select('id')
        .or(`and(user_one_id.eq.${user_one_id},user_two_id.eq.${user_two_id}),and(user_one_id.eq.${user_two_id},user_two_id.eq.${user_one_id})`)
        .limit(1)
        .single()
    if (existing) return res.json({ id: existing.id })
    const { data, error } = await supabase
        .from('conversations')
        .insert({ user_one_id, user_two_id })
        .select()
        .single()
    if (error) return res.status(500).json({ message: error.message })
    res.json({ id: data.id })
})

//POST send a message
router.post('/messages', verifyToken, async(req, res) =>{
    const { conversation_id, sender_id, content} = req.body
    const {data, error } = await supabase
      .from('messages')
      .insert({ conversation_id, sender_id, content})
    await supabase
    .from('conversations')
    .update({ last_message: content, last_message_at: new Date().toISOString() })
    .eq('id', conversation_id)
    if(error) return res.status(500).json({ message: error.message })
        res.json(data)
})

module.exports = router