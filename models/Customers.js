const mongoose = require("mongoose");

const customerSchema = mongoose.Schema({
  name: { type: String, minLength: 3, required: true, maxLength: 255 },
  phone: { type: String, minLength: 10, required: true },
  isGold: { type: Boolean, required: true },
});

const Customer = new mongoose.model("Customers", customerSchema);

exports.Customer = Customer;
exports.customerSchema = customerSchema;
