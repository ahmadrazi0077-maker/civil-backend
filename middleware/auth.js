// Admin auth middleware (JWT-based).
// Tokens are minted only by POST /api/auth/login after the admin password check.
// Set JWT_SECRET (and JWT_EXPIRE) as env vars in production — never commit them.
const jwt = require('jsonwebtoken');

const getSecret = () => process.env.JWT_SECRET || 'civilpro-dev-secret-change-me';
const getExpiry = () => process.env.JWT_EXPIRE || '7d';

if (!process.env.JWT_SECRET) {
  console.warn('⚠️  JWT_SECRET is not set — using insecure default secret. Set JWT_SECRET env var in production!');
}

// Mint a signed admin token (called by the login route)
const signAdminToken = (username) =>
  jwt.sign({ username, role: 'admin' }, getSecret(), { expiresIn: getExpiry() });

// Express middleware: rejects requests without a valid admin JWT
const protect = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : null;

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, getSecret());
    if (!decoded || decoded.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized, token invalid' });
  }
};

module.exports = { protect, signAdminToken, getSecret };
