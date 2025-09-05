type ValidationErrors = {
  email?: string;
  password?: string;
  name?: string;
  birth_date?: string;
};

const validateFields = (
  formData: any,
  fields: (keyof ValidationErrors)[]
): ValidationErrors => {
  const newErrors: ValidationErrors = {};

  if (fields.includes("email")) {
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
  }

  if (fields.includes("password")) {
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (
      !/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/.test(
        formData.password
      )
    ) {
      newErrors.password =
        "Password must contain uppercase, lowercase, number and special character";
    }
  }

  if (fields.includes("name")) {
    if (!formData.name) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
  }

  if (fields.includes("birth_date")) {
    if (!formData.birth_date) {
      newErrors.birth_date = "Birth date is required";
    } else {
      const birthDate = new Date(formData.birth_date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 16) {
        newErrors.birth_date = "You must be at least 16 years old";
      }
    }
  }

  return newErrors;
};
export default validateFields;
