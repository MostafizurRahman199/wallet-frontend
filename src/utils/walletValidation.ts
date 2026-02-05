import * as yup from "yup";

// Bangladeshi phone number regex
const bangladeshiPhoneRegex = /^01[3-9]\d{8}$/;

export const sendMoneySchema = yup.object({
  receiverPhone: yup
    .string()
    .matches(bangladeshiPhoneRegex, "Please enter a valid Bangladeshi phone number")
    .required("Receiver phone number is required"),

  amount: yup
    .number()
    .positive("Amount must be positive")
    .min(10, "Minimum amount is ৳10")
    .max(50000, "Maximum amount is ৳50,000")
    .required("Amount is required"),
});

export const cashOutSchema = yup.object({
  agentPhone: yup
    .string()
    .matches(bangladeshiPhoneRegex, "Please enter a valid Bangladeshi phone number")
    .min(11, "Phone number must be 11 digits")
    .max(11, "Phone number must be 11 digits")
    .required("Agent phone number is required"),

  amount: yup
    .number()
    .positive("Amount must be positive")
    .min(10, "Minimum cash-out amount is ৳10")
    .max(50000, "Maximum cash-out amount is ৳50,000")
    .required("Amount is required"),
});

export const topUpSchema = yup.object({
  amount: yup
    .number()
    .positive("Amount must be positive")
    .min(10, "Minimum top-up amount is ৳10")
    .max(50000, "Maximum top-up amount is ৳50,000")
    .required("Amount is required"),
});

export const agentCashInSchema = yup.object({
  userPhone: yup
    .string()
    .matches(bangladeshiPhoneRegex, "Please enter a valid Bangladeshi phone number")
    .required("User phone number is required"),

  amount: yup
    .number()
    .positive("Amount must be positive")
    .min(10, "Minimum amount is ৳10")
    .max(50000, "Maximum amount is ৳50,000")
    .required("Amount is required"),
});
