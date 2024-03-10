
import React, { useState } from 'react';
import './App.css'; // Import the CSS file for styling


const App = () => {
  // Initial form fields, including default fields
  const initialFormFields = [
    { type: 'text', label: 'Custom Text Input', validation: {} },
    { type: 'textarea', label: 'Custom Text Area', validation: {} },
    { type: 'checkbox', label: 'Custom Checkbox', validation: {} },
    { type: 'radio', label: 'Custom Radio Button', validation: {} },
    { type: 'email', label: 'Email', validation: { required: true, format: 'email' } },
    { type: 'phone', label: 'Phone Number', validation: { required: true, format: 'phone' } },
    { type: 'file', label: 'File Upload', validation: { required: true, allowedTypes: ['jpg', 'jpeg', 'png'], maxSize: 1024 * 1024 } },
  ];

  // used useState to manage the form fields
  const [formFields, setFormFields] = useState([...initialFormFields]);

  
  const [formData, setFormData] = useState({});

 
  const [formErrors, setFormErrors] = useState({});

  //  form submission function
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validationns form fields
    if (validateForm()) {
      
      console.log('Form submitted:', formData);

      // Reset after submission
      handleFormReset();
    }
  };

  // Function add new field
  const addFormField = (type, label) => {
    setFormFields([...formFields, { type, label, validation: {} }]);
  };

  // Function to handle removeee a form field
  const removeFormField = (type) => {
    setFormFields(formFields.filter((field) => field.type !== type));
    setFormData((prevData) => {
      const { [type]: removedField, ...restFormData } = prevData;
      return restFormData;
    });
    setFormErrors((prevErrors) => {
      const { [type]: removedError, ...restFormErrors } = prevErrors;
      return restFormErrors;
    });
  };

  //  value changes
  const handleFieldValueChange = (type, value) => {
    setFormData({ ...formData, [type]: value });

    // errorr value change
    setFormErrors((prevErrors) => {
      const { [type]: removedError, ...restFormErrors } = prevErrors;
      return restFormErrors;
    });
  };

  //  reset functiiiion
  const handleFormReset = () => {
    setFormFields([...initialFormFields]);
    setFormData({});
    setFormErrors({});
  };


  const validateForm = () => {
    let isValid = true;
    const errors = {};

    formFields.forEach((field) => {
      const { type, label, validation } = field;
      const value = formData[type];

      //req fields
      if (validation.required && !value) {
        isValid = false;
        errors[type] = `${label} is required`;
      }

      // min length
      if (validation.minLength && value.length < validation.minLength) {
        isValid = false;
        errors[type] = `${label} must be at least ${validation.minLength} characters`;
      }

      //  max length
      if (validation.maxLength && value.length > validation.maxLength) {
        isValid = false;
        errors[type] = `${label} must not exceed ${validation.maxLength} characters`;
      }

      // Checksformats  email, phone number
      if (validation.format && !validateFormat(value, validation.format)) {
        isValid = false;
        errors[type] = `Invalid ${label} format`;
      }

      // Checks for file type size
      if (type === 'file' && value) {
        const fileType = value.name.split('.').pop().toLowerCase();
        const fileSize = value.size;

        // Che file types
        if (validation.allowedTypes && !validation.allowedTypes.includes(fileType)) {
          isValid = false;
          errors[type] = `Invalid file type for ${label}. Allowed types: ${validation.allowedTypes.join(', ')}`;
        }

        // Check max file size
        if (validation.maxSize && fileSize > validation.maxSize) {
          isValid = false;
          errors[type] = `${label} must not exceed ${validation.maxSize / (1024 * 1024)} MB`;
        }
      }
    });

    // Set form errors
    setFormErrors(errors);

    return isValid;
  };

  // Function validate mail phone number)
  const validateFormat = (value, format) => {
    const regexMap = {
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      phone: /^\d{10}$/,
    };

    return regexMap[format] ? regexMap[format].test(value) : true;
  };

  // Function render based on their type
  const renderFormField = (field) => {
    const { type, label } = field;

    switch (type) {
      case 'text':
        return (
          <>
            <input
              type="text"
              placeholder={`Enter ${label}`}
              onChange={(e) => handleFieldValueChange(type, e.target.value)}
            />
            <span className="error">{formErrors[type]}</span>
          </>
        );
      case 'textarea':
        return (
          <>
            <textarea
              placeholder={`Enter ${label}`}
              onChange={(e) => handleFieldValueChange(type, e.target.value)}
            />
            <span className="error">{formErrors[type]}</span>
          </>
        );
      case 'checkbox':
        return (
          <>
            <input
              type="checkbox"
              onChange={(e) => handleFieldValueChange(type, e.target.checked)}
            />
            <span className="error">{formErrors[type]}</span>
          </>
        );
      case 'radio':
        return (
          <>
            <input
              type="radio"
              name={`radio-${type}`}
              onChange={(e) => handleFieldValueChange(type, e.target.value)}
            />
            <span className="error">{formErrors[type]}</span>
          </>
        );
      case 'email':
        return (
          <>
            <input
              type="text"
              placeholder={`Enter ${label}`}
              onChange={(e) => handleFieldValueChange(type, e.target.value)}
            />
            <span className="error">{formErrors[type]}</span>
          </>
        );
      case 'phone':
        return (
          <>
            <input
              type="text"
              placeholder={`Enter ${label}`}
              onChange={(e) => handleFieldValueChange(type, e.target.value)}
            />
            <span className="error">{formErrors[type]}</span>
          </>
        );
      case 'file':
        return (
          <>
            <input
              type="file"
              onChange={(e) => handleFieldValueChange(type, e.target.files[0])}
            />
            <span className="error">{formErrors[type]}</span>
          </>
        );
      default:
        return null;
    }
  };

  // Renderinggg the main form generator UI
  return (
    <div className="form-generator-container">
      <h1>Dynamic Form Generator</h1>
      <form onSubmit={handleSubmit} className="form-generator-form">
        {/* Render form fields */}
        {formFields.map((field) => (
          <div key={field.type} className="form-field">
            <label>{`${field.label}: `}</label>
            {renderFormField(field)}
            <button type="button" onClick={() => removeFormField(field.type)}>
              Remove
            </button>
          </div>
        ))}

        {/* Add new form field button */}
        <div className="add-field-section">
          <label>Add new field:</label>
          <select onChange={(e) => addFormField(e.target.value, e.target.options[e.target.selectedIndex].text)}>
            <option value="text">Text Input</option>
            <option value="textarea">Text Area</option>
            <option value="checkbox">Checkbox</option>
            <option value="radio">Radio Button</option>
            <option value="email">Email</option>
            <option value="phone">Phone Number</option>
            <option value="file">File Upload</option>
          </select>
        </div>

        {/* Submit, Reset, and Error buttons */}
        <div className="form-buttons">
          <button type="submit">Submit Form</button>
          <button type="button" onClick={handleFormReset}>
            Reset Form
          </button>
        </div>

        {/* Display form errors */}
        <div className="form-errors">
          {Object.values(formErrors).map((error) => (
            <div key={error} className="error">
              {error}
            </div>
          ))}
        </div>
      </form>
    </div>
  );
};


export default App;
