import * as yup from "yup";

// Bangladeshi phone number regex
const bangladeshiPhoneRegex = /^01[3-9]\d{8}$/;

export const registerSchema = yup.object({
  name: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .matches(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces")
    .required("Name is required"),

  phone: yup
    .string()
    .matches(bangladeshiPhoneRegex, "Please enter a valid Bangladeshi phone number (e.g., 01712345678)")
    .required("Phone number is required"),

  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one lowercase letter, one uppercase letter, and one number",
    )
    .required("Password is required"),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),

  role: yup.string().oneOf(["user", "agent"], "Role must be either user or agent").default("user"),
});

export const loginSchema = yup.object({
  phone: yup
    .string()
    .matches(bangladeshiPhoneRegex, "Please enter a valid Bangladeshi phone number")
    .required("Phone number is required"),

  password: yup.string().required("Password is required"),
});

export const updateProfileSchema = yup
  .object({
    name: yup
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name cannot exceed 50 characters")
      .matches(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces")
      .optional(),

    phone: yup.string().matches(bangladeshiPhoneRegex, "Please enter a valid Bangladeshi phone number").optional(),
  })
  .test("at-least-one", "At least one field (name or phone) must be provided", function (value) {
    return !!(value.name || value.phone);
  });

export const changePasswordSchema = yup
  .object({
    currentPassword: yup.string().required("Current password is required"),
    newPassword: yup
      .string()
      .min(6, "New password must be at least 6 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "New password must contain at least one lowercase letter, one uppercase letter, and one number",
      )
      .required("New password is required"),
    confirmNewPassword: yup
      .string()
      .oneOf([yup.ref("newPassword")], "Passwords must match")
      .required("Confirm new password is required"),
  })
  .test("different-password", "New password must be different from current password", function (value) {
    return value.currentPassword !== value.newPassword;
  });
