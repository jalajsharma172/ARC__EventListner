import express from "express";
import { config } from "../config.js";

const router = express.Router();
const supabase = config.SUPABASE;

/**
 * GET /api/yaml?OwnerAddress=0x123
 * Get all workflows for an owner
 */
router.get("/api/yaml", async (req, res) => {
  const { OwnerAddress } = req.query;

  if (!OwnerAddress) {
    return res.status(400).json({
      error: "OwnerAddress is required",
    });
  }

  try {
    const { data, error } = await supabase
      .from("yaml")
      .select("*")
      .eq("OwnerAddress", OwnerAddress);

    if (error) return res.status(500).json({ error: error.message });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/yaml
 * Create workflow
 */
router.post("/api/yaml", async (req, res) => {
  const { OwnerAddress, WorkFlowName, YAML } = req.body;

  if (!OwnerAddress || !WorkFlowName || !YAML) {
    return res.status(400).json({
      error: "OwnerAddress, WorkFlowName and YAML are required",
    });
  }

  try {
    const { data, error } = await supabase
      .from("yaml")
      .insert([{ OwnerAddress, WorkFlowName, YAML }])
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/yaml
 * Replace YAML
 */
router.put("/api/yaml", async (req, res) => {
  const { OwnerAddress, WorkFlowName, YAML } = req.body;

  if (!OwnerAddress || !WorkFlowName || !YAML) {
    return res.status(400).json({
      error: "OwnerAddress, WorkFlowName and YAML are required",
    });
  }

  try {
    const { data, error } = await supabase
      .from("yaml")
      .update({ YAML })
      .eq("OwnerAddress", OwnerAddress)
      .eq("WorkFlowName", WorkFlowName)
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PATCH /api/yaml/name
 * Rename workflow
 */
router.patch("/api/yaml/name", async (req, res) => {
  const { OwnerAddress, OldWorkFlowName, NewWorkFlowName } = req.body;

  if (!OwnerAddress || !OldWorkFlowName || !NewWorkFlowName) {
    return res.status(400).json({
      error: "OwnerAddress, OldWorkFlowName and NewWorkFlowName are required",
    });
  }

  try {
    const { data, error } = await supabase
      .from("yaml")
      .update({ WorkFlowName: NewWorkFlowName })
      .eq("OwnerAddress", OwnerAddress)
      .eq("WorkFlowName", OldWorkFlowName)
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PATCH /api/yaml/status
 * Activate / Deactivate workflow
 */
router.patch("/api/yaml/status", async (req, res) => {
  const { OwnerAddress, WorkFlowName, IsActive } = req.body;

  if (
    !OwnerAddress ||
    !WorkFlowName ||
    typeof IsActive !== "boolean"
  ) {
    return res.status(400).json({
      error: "OwnerAddress, WorkFlowName and IsActive are required",
    });
  }

  try {
    const { data, error } = await supabase
      .from("yaml")
      .update({ IsActive })
      .eq("OwnerAddress", OwnerAddress)
      .eq("WorkFlowName", WorkFlowName)
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/yaml
 * Delete workflow
 */
router.delete("/api/yaml", async (req, res) => {
  const { OwnerAddress, WorkFlowName } = req.body;

  if (!OwnerAddress || !WorkFlowName) {
    return res.status(400).json({
      error: "OwnerAddress and WorkFlowName are required",
    });
  }

  try {
    const { error } = await supabase
      .from("yaml")
      .delete()
      .eq("OwnerAddress", OwnerAddress)
      .eq("WorkFlowName", WorkFlowName);

    if (error) return res.status(500).json({ error: error.message });

    res.json({
      success: true,
      message: "Workflow deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;