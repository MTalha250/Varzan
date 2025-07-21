import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    whatsapp: {
      type: String,
    },
    services: {
      type: [String],
      default: [],
    },
    references: {
      type: [String],
      default: [],
    },
    mediumOfContact: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Contact =
  mongoose.models.Contact || mongoose.model("Contact", contactSchema);

export default Contact;
