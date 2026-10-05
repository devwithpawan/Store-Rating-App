export const validateName = (name) => {
  if (!name.trim()) {
    return "Name is required";
  }

  if (name.length < 20) {
    return "Name must be at least 20 characters";
  }

  if (name.length > 60) {
    return "Name must not exceed 60 characters";
  }

  return "";
};

export const validateEmail = (email) => {
  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email.trim()) {
    return "Email is required";
  }

  if (!emailRegex.test(email)) {
    return "Enter a valid email address";
  }

  return "";
};

export const validateAddress = (address) => {
  if (address.length > 400) {
    return "Address must not exceed 400 characters";
  }

  return "";
};

export const validatePassword = (password) => {
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

  if (!password) {
    return "Password is required";
  }

  if (!passwordRegex.test(password)) {
    return "Password must be 8-16 characters with at least one uppercase letter and one special character";
  }

  return "";
};

export const validateRating = (rating) => {
  if (!rating) {
    return "Please select a rating";
  }

  if (rating < 1 || rating > 5) {
    return "Rating must be between 1 and 5";
  }

  return "";
};