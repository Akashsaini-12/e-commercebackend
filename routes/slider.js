const express = require("express");
const SliderSlide = require("../models/SliderSlide");
const { nextNumericId } = require("../utils/nextNumericId");
const { normalizeSlideTheme } = require("../utils/slideTheme");

const router = express.Router();

// Slider JSON is URLs only; hero crop/fit is handled in the storefront
// (src/components/HeaderSection/Slider.jsx) so full artwork can show edge-to-edge.

// GET /api/slider
router.get("/slider", async (req, res) => {
  try {
    const slides = await SliderSlide.find().sort({ id: 1 }).lean();
    // Backwards-compat: some older docs may have `imageUrl` instead of `images`
    const normalized = (slides || []).map((s) => {
      if (s && !s.images && s.imageUrl) return { ...s, images: s.imageUrl };
      return s;
    });
    res.json(normalized);
  } catch (err) {
    console.error("Error fetching slider slides", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/admin/slider
function normalizeSliderCategoryId(value) {
  if (value === undefined || value === null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function normalizeSlideSubheading(value) {
  if (value === undefined || value === null) return "";
  const s = String(value).trim();
  return s.length > 500 ? s.slice(0, 500) : s;
}

router.post("/admin/slider", async (req, res) => {
  try {
    const { title, subtitle, imageUrl, images, categoryId: rawCategoryId } = req.body;
    const image = imageUrl || images;

    if (
      !title ||
      !subtitle ||
      !Array.isArray(subtitle) ||
      subtitle.length === 0 ||
      !image
    ) {
      return res.status(400).json({
        error: "title, subtitle (array), and imageUrl are required",
      });
    }

    const nextId = await nextNumericId(SliderSlide, "id");

    const createPayload = {
      id: nextId,
      title,
      subtitle,
      subheading: normalizeSlideSubheading(req.body.subheading),
      images: image,
      categoryId: normalizeSliderCategoryId(rawCategoryId),
    };
    if (req.body.theme !== undefined) {
      createPayload.theme = normalizeSlideTheme(req.body.theme);
    }

    const doc = await SliderSlide.create(createPayload);

    return res.status(201).json(doc.toObject());
  } catch (err) {
    console.error("Error creating slider slide", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

