/**
 * Validate an input field based on its name and optional confirmation input.
 * @param {HTMLInputElement} input - The input field to validate.
 * @param {HTMLInputElement} [confirmInput] - Optional matching confirmation input (e.g., password confirmation).
 * @returns {boolean} - Returns true if the input is valid, otherwise false.
 */
function validateInput(input, confirmInput = null) {
  const name = input.name.toLowerCase();
  const value = input.value.trim();
  const errorMessageElement = input.nextElementSibling; // <p> for error messages.
  const confirmInputMessageElement = confirmInput ? confirmInput.nextElementSibling : null

  let isValid = true;
  let errorMessage = '';

  // Regex patterns for various input validations.
  const patterns = {
    username: /^[a-zA-Z0-9_]{3,20}$/, // Letters, numbers, underscores, 3-20 chars.
    name: /^[a-zA-Z\s'-]{2,50}$/, // Names with spaces, apostrophes, or hyphens.
    email: /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/, // Email pattern.
    password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/, // At least 8 chars, 1 letter, 1 number.
    phone: /^\+?[0-9]{7,15}$/, // Phone number (7-15 digits, optional +).
    url: /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/, // URL pattern.
    zip: /^\d{5}(-\d{4})?$/, // US ZIP code (12345 or 12345-6789).
    creditCard: /^4[0-9]{12}(?:[0-9]{3})?$/, // Visa card (as an example).
    date: /^\d{4}-\d{2}-\d{2}$/, // Date in YYYY-MM-DD format.
    ip: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(\d{1,3}\.){2}\d{1,3}$/, // IPv4 address.
    alphanumeric: /^[a-zA-Z0-9\s]{3,30}$/, // Letters, numbers, and spaces.
    numeric: /^\d+$/, // Numbers only.
    range: (min, max) => (val) => Number(val) >= min && Number(val) <= max, // Range validation.
  };

  // Perform validation based on the input's name or type.
  switch (name) {
    case 'username':
      if (!patterns.username.test(value)) {
        isValid = false;
        errorMessage = 'Username must be 3-20 characters with letters, numbers, or underscores.';
      }
      break;

    case 'firstname':
    case 'lastname':
    case 'name':
      if (!patterns.name.test(value)) {
        isValid = false;
        errorMessage = 'Name should contain 2-50 characters with letters, spaces, or hyphens.';
      }
      break;

    case 'email':
      if (!patterns.email.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address.';
      }
      if (confirmInput && value !== confirmInput.value) {
        isValid = false;
        confirmInputMessageElement.innerHTML = 'Emails do not match.';
      }
      break;

    case 'password':
      if (!patterns.password.test(value)) {
        isValid = false;
        errorMessage = 'Password must contain at least 8 characters, including a letter and a number.';
      }
      if (confirmInput && value !== confirmInput.value) {
        isValid = false;
        confirmInputMessageElement.innerHTML = 'Passwords do not match.';
      }
      break;

    case 'phone':
      if (!patterns.phone.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid phone number.';
      }
      break;

    case 'url':
      if (!patterns.url.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid URL.';
      }
      break;

    case 'zip':
      if (!patterns.zip.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid ZIP code.';
      }
      break;

    case 'creditcard':
      if (!patterns.creditCard.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid Visa credit card number.';
      }
      break;

    case 'date':
      if (!patterns.date.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a date in YYYY-MM-DD format.';
      }
      break;

    case 'ip':
      if (!patterns.ip.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid IPv4 address.';
      }
      break;

    case 'alphanumeric':
      if (!patterns.alphanumeric.test(value)) {
        isValid = false;
        errorMessage = 'Only letters, numbers, and spaces are allowed.';
      }
      break;

    case 'numeric':
      if (!patterns.numeric.test(value)) {
        isValid = false;
        errorMessage = 'Only numbers are allowed.';
      }
      break;

    case 'age':
      const isWithinRange = patterns.range(18, 100)(value);
      if (!isWithinRange) {
        isValid = false;
        errorMessage = 'Age must be between 18 and 100.';
      }
      break;

    default:
      if (!value) {
        isValid = false;
        errorMessage = 'This field is required.';
      }
      break;
  }

  // Display the error message or clear it.
  if (errorMessageElement) {
    errorMessageElement.textContent = isValid ? '' : errorMessage;
    //     errorMessageElement.style.color = isValid ? 'green' : 'red';
  }

  return isValid;
}

export default validateInput;