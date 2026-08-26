const express = require('express')
const router = express.Router()
const supabase = require('../supabase')

//GET all conversation for a user
router.get('/conversation/:userId', async (req, res)=>{
    const { userId } = req.params
    const { data, error } = await supabase
     .from('conversations')
     .select('*')
     .or(`user_one_id.eq.${userId}, user_two_id.eq.${userId}`)
     .order('last_message_at', { ascending: false})
    if(error) return res.status(500).json({ message: error.message })
        res.json(data)
})

//GET messaga for a conversation
router.get('/message/:conversationId', async(req,res)=>{
    const { conversationId } = req.params
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
    if(error) return res.status(500).json({ message: error.message })
        res.json(data)
} )

//POST send a message
router.post('/messages', async(req, res) =>{
    const { conversation_id, sender_id, content} = req.body
    const {data, error } = await supabase
      .from('messages')
      .insert({ conversation_id, sender_id, content})
    if(error) return res.status(500).json({ message: error.message })
        res.json(data)
})

module.exports = router