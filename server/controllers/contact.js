import Contact from "../models/contact.js";

export const createContact = async (req, res) => {
  const { firstName, lastName, email, message } = req.body;
  try {
    const contact = await Contact.create({
      firstName,
      lastName,
      email,
      message,
    });
    res.status(201).json({ message: "Message sent successfully", contact });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
