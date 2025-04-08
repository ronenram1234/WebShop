const Joi = require("joi");

const stockSchema = Joi.object({
  Brand: Joi.string().allow("").default(""),
  Model: Joi.string().allow("").default(""),
  Quantity: Joi.number().default(0),
  "Price (USD)": Joi.string().allow("").default(""),
  Condition: Joi.string().allow("").default(""),
  Description: Joi.string().allow("").default(""),
  Detail: Joi.string().allow("").default(""),
  "Product Category": Joi.string().allow("").default(""),
  "Part Number": Joi.string().allow("").default(""),
  SKU: Joi.string().allow("").default(""),
  "Serial Number": Joi.string().allow("").default(""),
  Location: Joi.string().allow("").default(""),
  Status: Joi.string().allow("").default(""),
});

module.exports = stockSchema;
