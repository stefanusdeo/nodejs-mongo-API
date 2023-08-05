const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { Customer } = require("../models/Customers");

const validation = (body) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    phone: Joi.string().min(10).max(255).required(),
    isGold: Joi.bool().required(),
  });

  return schema.validate(body);
};

router.get("/", async (req, res) => {
  const customer = await Customer.find().sort("name");
  return res.send(customer);
});

router.get("/:id", async (req, res) => {
  const findData = await Customer.findById({ _id: req.params.id });
  if (!findData) return res.status(404).send({ message: "Not Found!" });
  res.send({
    message: "Success",
    data: findData,
  });
});

router.post("/", (req, res) => {
  const resValidation = validation(req.body);
  if (resValidation.error)
    return res
      .status(400)
      .send({ message: "Bad Request", detail: resValidation.error.details });

  const payload = {
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold,
  };

  let customer = new Customer(payload);
  customer.save();
  res.send({ message: "Success" });
});

router.put("/:id", async (req, res) => {
  const resValidation = validation(req.body);
  if (resValidation.error)
    return res
      .status(400)
      .send({ message: "Bad Request", detail: resValidation.error.details });

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name, phone: req.body.phone, isGold: req.body.isGold },
    {
      new: true,
    }
  );

  if (!customer) return res.status(404).send({ message: "Not Found!" });

  res.send(customer);
});

router.delete("/:id", async (req, res) => {
  const data = await Customer.findByIdAndRemove(req.params.id);
  if (!data) {
    res.status(404).send({ message: "data not found!" });
    return;
  }

  res.send(data);
});

module.exports = router;
