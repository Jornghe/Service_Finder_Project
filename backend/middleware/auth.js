const jwt = require('jsonwebtoken')
const supabase = require('../supabase')

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' })
    }

    const token = authHeader.split(' ')[1]

    let decoded
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch {
        return res.status(401).json({ message: 'Invalid or expired token' })
    }

    const { data: user, error } = await supabase
        .from('users')
        .select('id, is_suspend, is_admin, is_provider')
        .eq('id', decoded.id)
        .single()

    if (error) return res.status(500).json({ message: 'Database error' })
    if (!user) return res.status(401).json({ message: 'User not found' })
    if (user.is_suspend) return res.status(403).json({ message: 'Your account has been suspended. Please contact support.' })

    req.user = {
        id: user.id,
        is_admin: user.is_admin,
        is_provider: user.is_provider
    }
    next()
}

const requireAdmin = (req, res, next) => {
    if (!req.user?.is_admin) return res.status(403).json({ message: 'Admin access required' })
    next()
}

module.exports = { verifyToken, requireAdmin }
