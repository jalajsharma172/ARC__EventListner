import express from 'express';
import fetch from 'node-fetch';
import { config } from '../config.js';

const router = express.Router();

router.get('/api/yaml', async (_req, res) => {
  try {
    const url = config.SUPABASE_URL.replace(/\/$/, '') + '/rest/v1/yaml?select=*';
    console.log('Fetching yaml from:', url);
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        'apikey': config.SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': 'Bearer ' + config.SUPABASE_SERVICE_ROLE_KEY,
      },
    });
    const text = await resp.text();
    console.log('Supabase yaml raw response:', resp.status, text.slice(0, 300));
    let json;
    try { json = JSON.parse(text); } catch { json = text; }
    if (!resp.ok) return res.status(resp.status).json({ error: json });
    return res.json(Array.isArray(json) ? json : json);
  } catch (err) {
    console.error('yaml fetch error:', err?.message || err);
    return res.status(500).json({ error: err?.message || String(err) });
  }
});

router.post('/api/yaml', async (req, res) => {
  const { WorkFlowName, YAML } = req.body || {};

  if (!WorkFlowName || !YAML) {
    return res.status(400).json({ error: 'Missing required fields: WorkFlowName, YAML' });
  }

  if (!config.SUPABASE_URL || !config.SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ error: 'Supabase not configured on server' });
  }

  try {
    const sbUrl = `${config.SUPABASE_URL.replace(/\/$/, '')}/rest/v1/yaml`;
    const resp = await fetch(sbUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': config.SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${config.SUPABASE_SERVICE_ROLE_KEY}`,
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({ WorkFlowName, YAML }),
    });

    const json = await resp.json().catch(() => null);
    if (!resp.ok) {
      console.error('Supabase yaml insert error', resp.status, json);
      return res.status(resp.status).json({ error: json });
    }

    console.log(`✅ YAML workflow saved: ${WorkFlowName}`);
    return res.json({ success: true, data: json });
  } catch (err) {
    console.error('Error saving YAML to Supabase:', err?.message || err);
    return res.status(500).json({ error: err?.message || String(err) });
  }
});

export default router;
