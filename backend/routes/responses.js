const express = require('express')
const router = express.Router()
const supabase = require('../supabase')
const { verifyToken } = require('../middleware/auth')

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
router.post('/', verifyToken, async (req, res)=>{
    const { request_id, provider_id, message } = req.body

    // Save the response
    const { error: responseError } = await supabase
        .from('request_responses')
        .insert({ request_id, provider_id, message })
    if (responseError) return res.status(500).json({ message: responseError.message })

    // Get the customer_id from the request
    const { data: requestData, error: requestError } = await supabase
        .from('service_requests')
        .select('customer_id')
        .eq('id', request_id)
        .single()
    if (requestError) return res.status(500).json({ message: requestError.message })

    const customer_id = requestData.customer_id

    // Find or create a conversation between provider and customer
    let conversation_id
    const { data: existing } = await supabase
        .from('conversations')
        .select('id')
        .or(`and(user_one_id.eq.${provider_id},user_two_id.eq.${customer_id}),and(user_one_id.eq.${customer_id},user_two_id.eq.${provider_id})`)
        .single()

    if (existing) {
        conversation_id = existing.id
    } else {
        const { data: newConv, error: convError } = await supabase
            .from('conversations')
            .insert({ user_one_id: provider_id, user_two_id: customer_id })
            .select('id')
            .single()
        if (convError) return res.status(500).json({ message: convError.message })
        conversation_id = newConv.id
    }

    // Insert message into the conversation
    const { error: msgError } = await supabase
        .from('messages')
        .insert({ conversation_id, sender_id: provider_id, content: message })
    if (msgError) return res.status(500).json({ message: msgError.message })

    // Update conversation's last message
    await supabase
        .from('conversations')
        .update({ last_message: message, last_message_at: new Date().toISOString() })
        .eq('id', conversation_id)

    res.json({ message: 'Response sent' })
})

    module.exports = router