import express from 'express';
import fetch from 'node-fetch';
import { config } from '../config.js';

const router = express.Router();

router.get('/api/workflows', async (_req, res) => {
  if (!config.SUPABASE_URL || !config.SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ error: 'Supabase not configured on server' });
  }

  try {
    const sbUrl = `${config.SUPABASE_URL.replace(/\/$/, '')}/rest/v1/Workflow`;
    const resp = await fetch(sbUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': config.SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${config.SUPABASE_SERVICE_ROLE_KEY}`,
      },
    });

    const json = await resp.json().catch(() => null);
    if (!resp.ok) {
      console.error('Supabase fetch workflows error', resp.status, json);
      return res.status(resp.status).json({ error: json });
    }

    return res.json(json || []);
  } catch (err) {
    console.error('Error fetching workflows from Supabase:', err?.message || err);
    return res.status(500).json({ error: err?.message || String(err) });
  }
});

export default router;
