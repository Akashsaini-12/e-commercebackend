const mongoose = require("mongoose");

const slideThemeSchema = new mongoose.Schema(
  {
    tagColor: { type: String, default: "" },
    tagLineColor: { type: String, default: "" },
    headline1Color: { type: String, default: "" },
    headline2Color: { type: String, default: "" },
    subheadingColor: { type: String, default: "" },
    buttonBg: { type: String, default: "" },
    buttonText: { type: String, default: "" },
  },
  { _id: false },
);

const sliderSlideSchema = new mongoose.Schema(
  {
    // Numeric id used for ordering and to avoid duplicate-key issues
    id: { type: Number, required: true, index: true, unique: true },
    title: { type: String, required: true },
    subtitle: { type: [String], required: true },
    subheading: { type: String, default: "" },
    // Store a single URL string
    images: { type: String, required: true },
    // Optional: "Shop Now" opens All Products filtered by this category (numeric id)
    categoryId: { type: Number, default: null, index: true },
    // Optional storefront colours (set from admin)
    theme: { type: slideThemeSchema, default: undefined },
  },
  { timestamps: true },
);

module.exports = mongoose.model("SliderSlide", sliderSlideSchema);

