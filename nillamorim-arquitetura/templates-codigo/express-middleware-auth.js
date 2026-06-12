// =====================================================================
// MIDDLEWARE: AUTH (JWT) — Padrão Imperatriz
// =====================================================================
// Compartilha 1 JWT entre todos os apps internos da Tata.
// Pra usar: crie pacote @imperatriz/middlewares e importe em cada app.
//
// Lugar: src/middlewares/auth.js (ou empacotar em NPM privado)
// Dependências: jsonwebtoken
// =====================================================================

const jwt = require('jsonwebtoken');

// Pegue do env. NUNCA hardcode.
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET nao definido. Sem isso, app nao roda.');
}

const JWT_ISSUER = process.env.JWT_ISSUER || 'imperatriz';

/**
 * Middleware que valida o JWT e injeta req.user.
 * Aceita token via:
 * - Header Authorization: Bearer <token>
 * - Cookie: token=<token>
 * - Query: ?token=<token> (apenas pra healthchecks/links de email)
 */
function requireAuth(options = {}) {
  const { optional = false, requireTenant = false } = options;

  return (req, res, next) => {
    const token = extractToken(req);

    if (!token) {
      if (optional) {
        req.user = null;
        return next();
      }
      return res.status(401).json({ error: 'token ausente' });
    }

    try {
      const payload = jwt.verify(token, JWT_SECRET, { issuer: JWT_ISSUER });

      // Valida claims minimas
      if (!payload.userId) {
        return res.status(401).json({ error: 'token invalido (sem userId)' });
      }

      // Multi-tenant: tenant_id obrigatorio?
      if (requireTenant && !payload.tenantId) {
        return res.status(401).json({ error: 'token invalido (sem tenantId)' });
      }

      req.user = {
        id: payload.userId,
        email: payload.email,
        tenantId: payload.tenantId || null,
        role: payload.role || 'user',
        permissions: payload.permissions || [],
      };

      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'token expirado' });
      }
      return res.status(401).json({ error: 'token invalido' });
    }
  };
}

/**
 * Middleware que exige uma permission especifica.
 * Usar APOS requireAuth.
 */
function requirePermission(permission) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'nao autenticado' });
    }
    if (!req.user.permissions.includes(permission)) {
      return res.status(403).json({ error: `permissao ${permission} requerida` });
    }
    next();
  };
}

/**
 * Middleware que exige role.
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'nao autenticado' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: `role ${roles.join(' ou ')} requerida` });
    }
    next();
  };
}

/**
 * Gera token (pra login).
 */
function signToken(payload, options = {}) {
  const { expiresIn = '7d' } = options;
  return jwt.sign(
    payload,
    JWT_SECRET,
    { issuer: JWT_ISSUER, expiresIn }
  );
}

function extractToken(req) {
  // 1. Authorization: Bearer <token>
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) {
    return auth.slice(7);
  }

  // 2. Cookie: token=<token>
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }

  // 3. Query: ?token=<token> (use com moderacao)
  if (req.query && req.query.token) {
    return req.query.token;
  }

  return null;
}

module.exports = {
  requireAuth,
  requirePermission,
  requireRole,
  signToken,
};

// =====================================================================
// EXEMPLO DE USO
// =====================================================================
//
// const { requireAuth, requirePermission } = require('@imperatriz/middlewares');
//
// // Rota publica
// app.get('/health', (req, res) => res.send('ok'));
//
// // Rota protegida
// app.get('/dashboard', requireAuth(), (req, res) => {
//   res.json({ user: req.user });
// });
//
// // Multi-tenant
// app.get('/api/tenant-data', requireAuth({ requireTenant: true }), (req, res) => {
//   // req.user.tenantId garantido aqui
// });
//
// // Permission especifica
// app.delete('/api/users/:id',
//   requireAuth(),
//   requirePermission('users.delete'),
//   handler
// );
//
// // Role
// app.get('/api/admin', requireAuth(), requireRole('admin', 'superadmin'), handler);
//
// =====================================================================
