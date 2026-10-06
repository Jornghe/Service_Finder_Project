const express = require('express')
const router = express.Router()
const supabase = require('../supabase')
const multer = require('multer')
const { verifyToken } = require('../middleware/auth')
const upload = multer({ storage: multer.memoryStorage() })

//POST upload service photo
router.post('/upload-photo', verifyToken, upload.single('photo'), async (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' })
    const { userId } = req.body
    const ext = req.file.originalname.split('.').pop()
    const fileName = `${userId}-${Date.now()}.${ext}`
    const { error } = await supabase.storage
        .from('service-photos')
        .upload(fileName, req.file.buffer, { contentType: req.file.mimetype, upsert: true })
    if (error) return res.status(500).json({ message: error.message })
    const { data } = supabase.storage.from('service-photos').getPublicUrl(fileName)
    res.json({ photo_url: data.publicUrl })
})

//Get all services
router.get('/', async (req, res) =>{
    const { data, error} = await supabase
    .from('services')
    .select('*, working_hours(*)')
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


//GET services by user
router.get('/user/:userId', async (req, res) =>{
    const { userId } = req.params
    const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    if(error) return res.status(500).json({ message: error.message })
        res.json(data)
})

//DELETE a service
router.delete('/:id', verifyToken, async (req, res) => {
    const { id } = req.params
    const { data: service, error: fetchError } = await supabase
        .from('services').select('user_id').eq('id', id).single()
    if (fetchError || !service) return res.status(404).json({ message: 'Service not found' })
    if (req.user.id !== service.user_id && !req.user.is_admin) return res.status(403).json({ message: 'Access denied' })
    const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id)
    if (error) return res.status(500).json({ message: error.message })
    res.json({ message: 'Service deleted' })
})

//PATCH update a service
router.patch('/:id', verifyToken, async (req, res) => {
    const { id } = req.params
    const { data: service, error: fetchError } = await supabase
        .from('services').select('user_id').eq('id', id).single()
    if (fetchError || !service) return res.status(404).json({ message: 'Service not found' })
    if (req.user.id !== service.user_id && !req.user.is_admin) return res.status(403).json({ message: 'Access denied' })
    const { name, category, phone, address, description, latitude, longitude, photo_url, price_min, price_max, provider_type, service_range_km } = req.body
    const { error } = await supabase
    .from('services')
    .update({ name, category, phone, address, description, latitude, longitude, photo_url, price_min, price_max, provider_type, service_range_km })
    .eq('id', id)
    if (error) return res.status(500).json({ message: error.message })
    res.json({ message: 'Service updated' })
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

//POST create a service
router.post('/', verifyToken, async (req, res) =>{
    const { user_id, name, category, phone, address, description, latitude, longitude, photo_url, price_min, price_max, provider_type, service_range_km } = req.body
    const slug = name.toLowerCase().replace(/ /g, '-') + '-' + Date.now()
    const { data, error } = await supabase
    .from('services')
    .insert([{ user_id, name, category, phone, address, description, latitude, longitude, photo_url, slug, provider_type: provider_type || 'freelancer', service_mode:'both', price_min: price_min || 0, price_max: price_max || 0, service_range_km: service_range_km || null, is_active: true }])
    .select()
    .single()
 if (error) return res.status(500).json({ message: error.message })
    res.json(data)
})


module.exports = router
