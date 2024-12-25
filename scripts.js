document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('miftahForm');
    const formContainer = document.getElementById('formContainer');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const successPage = document.getElementById('successPage');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        if (validateForm()) {
            // Show loading overlay
            loadingOverlay.style.display = 'flex';
            
            // Collect form data
            const formData = new FormData(this);
            const data = {};
            
            // Convert FormData to plain object
            formData.forEach((value, key) => {
                data[key] = value;
            });

            // Handle file upload separately
            const resumeFile = document.getElementById('resume').files[0];
            if (resumeFile) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    // Add base64 encoded file to data
                    data.resume = event.target.result;
                    submitFormData(data);
                };
                reader.readAsDataURL(resumeFile);
            } else {
                // If no file is uploaded, still submit the form
                data.resume = null;
                submitFormData(data);
            }
        }
    });

    function validateForm() {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                highlightField(field);
            } else {
                removeHighlight(field);
            }
        });

        // Email validation
        const emailField = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
            isValid = false;
            highlightField(emailField);
        }

        // Phone number validation (basic)
        const phoneField = document.getElementById('phone');
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phoneField.value.replace(/\s/g, ''))) {
            isValid = false;
            highlightField(phoneField);
        }

        if (!isValid) {
            alert('Please fill all required fields correctly.');
        }

        return isValid;
    }

    function highlightField(field) {
        field.style.borderColor = '#e74c3c';
    }

    function removeHighlight(field) {
        field.style.borderColor = '#e0e0e0';
    }

    function submitFormData(data) {
        // Updated Apps Script Web App URL you provided
      const url = "https://script.google.com/macros/s/AKfycbwt71sMxQcbYMtqpekTsxIv7UylU9VMwth5IpSF96VvMApq7DSnlBv6s8woPkWCEPVP/exec";
        
        // Convert data to JSON
        const payload = JSON.stringify(data);

        // Use fetch for submission
        fetch(url, {
            method: 'POST',
            mode: 'no-cors', // Important for cross-origin requests
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            body: payload
        })
        .then(response => {
            // Hide loading overlay
            loadingOverlay.style.display = 'none';
            
            // Show success page
            formContainer.style.display = 'none';
            successPage.style.display = 'block';
            
            // Optional: Reset form
            form.reset();
        })
        .catch(error => {
            console.error('Error:', error);
            
            // Hide loading overlay
            loadingOverlay.style.display = 'none';
            
            alert('There was an error submitting your application. Please try again.');
        });
    }
});
