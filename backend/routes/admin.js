const express = require('express');
const router = express.Router();
const supabase = require('../supabase');
const { verifyToken, requireAdmin } = require('../middleware/auth');

//GET stats
router.get('/stats', verifyToken, requireAdmin, async (req, res) => {
    const { count: totalUsers } = await supabase.from('users').select('*', { count: 'exact', head: true });
    const { count: totalProviders } = await supabase.from('users').select('*', { count: 'exact', head: true }).eq('is_provider', true);
    const { count: pendingVerifications } = await supabase.from('verification_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending');
    const { data: ratingData } = await supabase.from('services').select('avg_rating');
    const avgRating = ratingData && ratingData.length
    ? (ratingData.reduce((sum,s) => sum + (s.avg_rating || 0), 0) / ratingData.length).toFixed(1)
    : 0;
    res.json({ totalUsers, totalProviders, pendingVerifications, avgRating });
});

//GET all users
router.get('/users', verifyToken, requireAdmin, async (req, res) => {
    const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });
    if(error) return res.status(500).json({ error: error.message });
    res.json(data);
});

//PATCH suspend/unsuspend user
router.patch('/users/:id/suspend', verifyToken, requireAdmin, async (req, res) => {
    const { id } = req.params;
    const { suspend } = req.body;
    const { error } = await supabase.from('users').update({ is_suspend: suspend }).eq('id', id);
    if(error) return res.status(500).json({ error: error.message });
    res.json({ message: suspend ? 'User suspended' : 'User unsuspended' });
});

//GET all listings
router.get('/listings', verifyToken, requireAdmin, async (req, res) => {
    const { data, error } = await supabase.from('services').select('*,users(name)').order('created_at', { ascending: false });
    if(error) return res.status(500).json({ error: error.message });
    res.json(data);
}); 

//DELETE listing
router.delete('/listings/:id', verifyToken, requireAdmin, async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('services').delete().eq('id', id);
    if(error) return res.status(500).json({ message: error.message });
    res.json({ message: 'Listing removed' });
});

//GET all verification requests grouped by service
router.get('/verifications', verifyToken, requireAdmin, async (req, res) => {
    const { data, error } = await supabase
        .from('verification_requests')
        .select('*, users(name), services(name)')
        .order('created_at', { ascending: false });
    if(error) return res.status(500).json({ error: error.message });

    // Group rows by service_id
    const grouped = {}
    for (const row of data) {
        const sid = row.service_id
        if (!grouped[sid]) {
            grouped[sid] = {
                service_id: sid,
                service_name: row.services?.name,
                provider_name: row.users?.name,
                submitted_at: row.created_at,
                status: row.status,
                documents: []
            }
        }
        grouped[sid].documents.push({ id: row.id, document_type: row.document_type, document_url: row.document_url })
        // If any doc is pending, the whole group is pending
        if (row.status === 'pending') grouped[sid].status = 'pending'
    }

    res.json(Object.values(grouped));
});

//PATCH approve all verification docs for a service
router.patch('/verifications/:serviceId/approve', verifyToken, requireAdmin, async (req, res) => {
    const { serviceId } = req.params;
    const { error } = await supabase
        .from('verification_requests')
        .update({ status: 'approved' })
        .eq('service_id', serviceId)
    if(error) return res.status(500).json({ message: error.message });
    await supabase.from('services').update({ is_verified: true }).eq('id', serviceId)
    res.json({ message: 'Verification approved' });
});

//PATCH reject all verification docs for a service
router.patch('/verifications/:serviceId/reject', verifyToken, requireAdmin, async (req, res) => {
    const { serviceId } = req.params;
    const { error } = await supabase
        .from('verification_requests')
        .update({ status: 'rejected' })
        .eq('service_id', serviceId)
    if(error) return res.status(500).json({ message: error.message });
    res.json({ message: 'Verification rejected' });
});

//GET all requests
router.get('/requests', verifyToken, requireAdmin, async (req, res) => {
    const { data, error } = await supabase.from('service_requests').select('*, users(name)').order('created_at', { ascending: false });
    if(error) return res.status(500).json({ message: error.message });

    res.json(data);
});

//GET all reviews
router.get('/reviews', verifyToken, requireAdmin, async (req, res) => {
    const { data, error } = await supabase.
    from('reviews')
    .select('*, users(name), services(name)')
    .order('created_at', { ascending: false });
    if(error) return res.status(500).json({ message: error.message });
    res.json(data);
});

//DELETE review
router.delete('/reviews/:id', verifyToken, requireAdmin, async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('reviews').delete().eq('id', id);
    if(error) return res.status(500).json({ message: error.message });
    res.json({ message: 'Review removed' });
});

module.exports = router;