import Testimonial from "../models/testimonial.js";

export const createTestimonial = async (req, res) => {
  const { image = "", name, email, message } = req.body;
  try {
    const testimonial = await Testimonial.create({
      image,
      name,
      email,
      message,
    });
    res
      .status(201)
      .json({ message: "Testimonial created successfully", testimonial });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTestimonials = async (req, res) => {
  const { page = 1, limit = 12 } = req.query;
  try {
    const totalTestimonials = await Testimonial.countDocuments();
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const testimonials = await Testimonial.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    res.status(200).json({
      testimonials,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalTestimonials / parseInt(limit)),
      totalTestimonials,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.status(200).json({ testimonials });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTestimonial = async (req, res) => {
  const { id } = req.params;
  try {
    const testimonial = await Testimonial.findById(id);
    if (!testimonial)
      return res.status(404).json({ message: "Testimonial not found" });
    res.status(200).json({ testimonial });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTestimonial = async (req, res) => {
  const { id } = req.params;
  const { image = "", name, email, message } = req.body;
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      { image, name, email, message },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Testimonial updated successfully", testimonial });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTestimonial = async (req, res) => {
  const { id } = req.params;
  try {
    await Testimonial.findByIdAndDelete(id);
    res.status(200).json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
