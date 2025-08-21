module.exports = (req, res) => {
  const { url } = req;
  
  // Route to appropriate handler based on URL
  try {
    if (url.startsWith('/api/dashboard-summary')) {
      return require('./dashboard-summary')(req, res);
    } else if (url.startsWith('/api/delivery-all')) {
      return require('./delivery-all')(req, res);
    } else if (url.startsWith('/api/delivery')) {
      return require('./delivery')(req, res);
    } else if (url.startsWith('/api/employability-all')) {
      return require('./employability-all')(req, res);
    } else if (url.startsWith('/api/employability')) {
      return require('./employability')(req, res);
    } else if (url.startsWith('/api/quality-all')) {
      return require('./quality-all')(req, res);
    } else if (url.startsWith('/api/quality')) {
      return require('./quality')(req, res);
    } else if (url.startsWith('/api/sales-pipeline-all')) {
      return require('./sales-pipeline-all')(req, res);
    } else if (url.startsWith('/api/sales-pipeline')) {
      return require('./sales-pipeline')(req, res);
    } else if (url.startsWith('/api/delete/delivery')) {
      return require('./delete/delivery')(req, res);
    } else if (url.startsWith('/api/delete/employability')) {
      return require('./delete/employability')(req, res);
    } else if (url.startsWith('/api/delete/quality')) {
      return require('./delete/quality')(req, res);
    } else if (url.startsWith('/api/delete/sales-pipeline')) {
      return require('./delete/sales-pipeline')(req, res);
    } else {
      res.status(404).json({ error: 'API endpoint not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};