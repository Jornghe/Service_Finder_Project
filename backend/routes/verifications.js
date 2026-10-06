const express = require('express')
const router = express.Router()
const supabase = require('../supabase')
const multer = require('multer')
const { verifyToken, requireAdmin } = require('../middleware/auth')
const upload = multer({ storage: multer.memoryStorage() })

// POST upload a verification document
router.post('/upload', verifyToken, upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' })
    const { userId, documentType } = req.body
    const ext = req.file.originalname.split('.').pop()
    const fileName = `${userId}-${documentType}-${Date.now()}.${ext}`
    const { error } = await supabase.storage
        .from('documents')
        .upload(fileName, req.file.buffer, { contentType: req.file.mimetype, upsert: true })
    if (error) return res.status(500).json({ message: error.message })
    res.json({ url: fileName })
})

// GET signed URL for a document
router.get('/signed-url', verifyToken, requireAdmin, async (req, res) => {
    const { path } = req.query
    const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(path, 3600)
    if (error) return res.status(500).json({ message: error.message })
    res.json({ url: data.signedUrl })
})

// GET check if pending verification exists for a service
router.get('/check/:serviceId', async (req, res) => {
    const { serviceId } = req.params
    const { data, error } = await supabase
        .from('verification_requests')
        .select('id')
        .eq('service_id', serviceId)
        .eq('status', 'pending')
        .limit(1)
    if (error) return res.status(500).json({ message: error.message })
    res.json({ hasPending: data.length > 0 })
})

// POST save verification record
router.post('/', verifyToken, async (req, res) => {
    const { service_id, provider_id, document_type, document_url } = req.body
    const { error } = await supabase
        .from('verification_requests')
        .insert({ service_id, provider_id, document_type, document_url, status: 'pending' })
    if (error) return res.status(500).json({ message: error.message })
    res.json({ message: 'Verification submitted' })
})

module.exports = router
