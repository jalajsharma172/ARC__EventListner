import express from 'express';
import fetch from 'node-fetch';
import { config } from '../config.js';

const router = express.Router();

// Price Alerts API
router.post('/api/price-alerts', async (req, res) => {
  try {
    const { workflowName, chain, targetPrice, api, body } = req.body;

    if (!workflowName || !targetPrice) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate JSON body
    let parsedBody = body;
    try {
      if (typeof body === 'string') {
        parsedBody = JSON.parse(body);
      }
    } catch (e) {
      return res.status(400).json({ error: 'Invalid JSON in body' });
    }

    // Use Fetch to Supabase REST API
    const sbUrl = `${config.SUPABASE_URL.replace(/\/$/, '')}/rest/v1/PriceAlerts`;

    const response = await fetch(sbUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': config.SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${config.SUPABASE_SERVICE_ROLE_KEY}`,
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({
        WorkflowName: workflowName,
        Chain: chain,
        The: parseFloat(targetPrice),
        API: api,
        Body: parsedBody
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Supabase error:', response.status, errorText);
      throw new Error(`Supabase error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error creating price alert:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Get all PriceAlerts
router.get('/api/price-alerts', async (_req, res) => {
  try {
    if (!config.SUPABASE_URL || !config.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase credentials missing");
    }

    const sbUrl = `${config.SUPABASE_URL.replace(/\/$/, '')}/rest/v1/PriceAlerts?select=*`;
    const response = await fetch(sbUrl, {
      method: 'GET',
      headers: {
        'apikey': config.SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${config.SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error fetching PriceAlerts:', response.status, errorText);
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();


    const ethprice = await fetch('https://pxl6dnbsdl.execute-api.us-east-1.amazonaws.com/eth-data', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const ethResponse = await ethprice.json();
    console.log("DEBUG: Full ETH Response:", JSON.stringify(ethResponse, null, 2));

    const ethData = ethResponse.data || {};
    console.log("DEBUG: ethData keys:", Object.keys(ethData));
    console.log("DEBUG: timestamp value:", ethData.timestamp);

    const results = [];

    for (const alert of data) {
      try {
        let bodyString = JSON.stringify(alert.Body);
        console.log(`DEBUG: Original Body for Alert ${alert.id}:`, bodyString);

        // Replace placeholders with flexible regex for spaces
        bodyString = bodyString.replace(/re\.event\s*\(\s*0\s*\)/g, String(ethData.eth_usd || ''));
        bodyString = bodyString.replace(/re\.event\s*\(\s*1\s*\)/g, String(ethData.eth_inr || ''));
        bodyString = bodyString.replace(/re\.event\s*\(\s*2\s*\)/g, String(ethData.timestamp || ''));

        console.log(`DEBUG: Processed Body for Alert ${alert.id}:`, bodyString);

        const processedBody = JSON.parse(bodyString);

        console.log(`Processing Alert ID ${alert.id}: Calling ${alert.API}`);

        const alertResp = await fetch(alert.API, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(processedBody)
        });

        const resultJson = await alertResp.json().catch(() => null);
        results.push({
          id: alert.id,
          status: alertResp.status,
          response: resultJson
        });

      } catch (err) {
        console.error(`Error processing alert ${alert.id}:`, err);
        results.push({
          id: alert.id,
          error: String(err)
        });
      }
    }

    return res.json({
      message: "Price alerts processed",
      eth_data: ethData,
      results: results
    });
  } catch (error) {
    console.error('Exception fetching PriceAlerts:', error);
    return res.status(500).json({ error: String(error) });
  }
});

export default router;
