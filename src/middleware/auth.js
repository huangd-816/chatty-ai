// Optional shared-secret gate. No-op unless APP_TOKEN is set in the env,
// so existing deployments keep working unchanged. When set, callers must
// send a matching `x-app-token` header.
import config from '../config.js';

export function requireToken(req, res, next) {
  if (!config.appToken) return next();
  if (req.get('x-app-token') === config.appToken) return next();
  return res.status(401).json({ error: 'Unauthorized' });
}
