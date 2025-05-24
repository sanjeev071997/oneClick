import Contact from "../models/contactModel.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Errorhandler from "../utils/Errorhandler.js";

// Add Conatct
export const addContact = catchAsyncErrors(async (req, res, next) => {
  try {
    const newContact = await Contact.create(req.body);
    res.status(200).json({
      success: true,
      newContact,
      message: "Contact added successfully",
    });
  } catch (error) {
    return next(new Errorhandler(error.message, 500));
  }
});


// Delete Contact
export const deleteContact = catchAsyncErrors(async (req, res, next) => {
  try {
    const { id } = req.body;
    const contact = await Contact.findById(id);
    if (!contact) {
      return next(new Errorhandler("Contact not found", 404));
    }
    await Contact.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Contact deleted successfully",
    });
  } catch (error) {
    return next(new Errorhandler(error.message, 500));
  }
});


// Admin Get all Contacts
export const adminGetAllContacts = catchAsyncErrors(async (req, res, next) => {
  try {
    const contact = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      contact,
      message: "Contact details fetched successfully",
    });
  } catch (error) {
    return next(new Errorhandler(error.message, 500));
  }
});