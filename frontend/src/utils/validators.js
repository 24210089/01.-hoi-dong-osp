// src/utils/validators.js

/**
 * Validate email
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (Vietnam)
 * @param {string} phone
 * @returns {boolean}
 */
export const isValidPhone = (phone) => {
  if (!phone) return false;
  const phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
};

/**
 * Validate Vietnamese ID card
 * @param {string} idCard
 * @returns {boolean}
 */
export const isValidIDCard = (idCard) => {
  if (!idCard) return false;
  // Old format: 9 digits, New format: 12 digits
  const idCardRegex = /^(\d{9}|\d{12})$/;
  return idCardRegex.test(idCard);
};

/**
 * Validate date
 * @param {string} date
 * @returns {boolean}
 */
export const isValidDate = (date) => {
  if (!date) return false;
  const d = new Date(date);
  return !isNaN(d.getTime());
};

/**
 * Validate date range
 * @param {string} startDate
 * @param {string} endDate
 * @returns {boolean}
 */
export const isValidDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return false;
  const start = new Date(startDate);
  const end = new Date(endDate);
  return start <= end;
};

/**
 * Validate required field
 * @param {any} value
 * @returns {boolean}
 */
export const isRequired = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

/**
 * Validate min length
 * @param {string} value
 * @param {number} minLength
 * @returns {boolean}
 */
export const isMinLength = (value, minLength) => {
  if (!value) return false;
  return value.length >= minLength;
};

/**
 * Validate max length
 * @param {string} value
 * @param {number} maxLength
 * @returns {boolean}
 */
export const isMaxLength = (value, maxLength) => {
  if (!value) return true;
  return value.length <= maxLength;
};

/**
 * Validate min value
 * @param {number} value
 * @param {number} min
 * @returns {boolean}
 */
export const isMinValue = (value, min) => {
  if (value === null || value === undefined) return false;
  return Number(value) >= min;
};

/**
 * Validate max value
 * @param {number} value
 * @param {number} max
 * @returns {boolean}
 */
export const isMaxValue = (value, max) => {
  if (value === null || value === undefined) return false;
  return Number(value) <= max;
};

/**
 * Validate password strength
 * @param {string} password
 * @returns {object} { isValid, strength, message }
 */
export const validatePassword = (password) => {
  if (!password) {
    return {
      isValid: false,
      strength: 0,
      message: "Mật khẩu không được để trống",
    };
  }

  let strength = 0;
  const messages = [];

  // Length
  if (password.length >= 8) {
    strength += 1;
  } else {
    messages.push("Ít nhất 8 ký tự");
  }

  // Lowercase
  if (/[a-z]/.test(password)) {
    strength += 1;
  } else {
    messages.push("Có chữ thường");
  }

  // Uppercase
  if (/[A-Z]/.test(password)) {
    strength += 1;
  } else {
    messages.push("Có chữ hoa");
  }

  // Numbers
  if (/\d/.test(password)) {
    strength += 1;
  } else {
    messages.push("Có số");
  }

  // Special characters
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    strength += 1;
  } else {
    messages.push("Có ký tự đặc biệt");
  }

  return {
    isValid: strength >= 3,
    strength,
    message:
      messages.length > 0 ? `Cần: ${messages.join(", ")}` : "Mật khẩu mạnh",
  };
};

/**
 * Validate URL
 * @param {string} url
 * @returns {boolean}
 */
export const isValidURL = (url) => {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate file type
 * @param {File} file
 * @param {string[]} allowedTypes
 * @returns {boolean}
 */
export const isValidFileType = (file, allowedTypes) => {
  if (!file) return false;
  return allowedTypes.includes(file.type);
};

/**
 * Validate file size
 * @param {File} file
 * @param {number} maxSize - in bytes
 * @returns {boolean}
 */
export const isValidFileSize = (file, maxSize) => {
  if (!file) return false;
  return file.size <= maxSize;
};

/**
 * Validate age range
 * @param {string|Date} birthDate
 * @param {number} minAge
 * @param {number} maxAge
 * @returns {boolean}
 */
export const isValidAgeRange = (birthDate, minAge = 0, maxAge = 150) => {
  if (!birthDate) return false;

  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age >= minAge && age <= maxAge;
};
