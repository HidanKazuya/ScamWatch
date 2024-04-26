document.getElementById('scamReportForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    const formData = {
        userName: document.getElementById('userName').value,
        title: document.getElementById('title').value,
        scamType: document.getElementById('scamType').value,
        description: document.getElementById('description').value,
        date: document.getElementById('date').value,
        platform: document.getElementById('platform').value
    };

    fetch('/submit-report', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        alert('Report Submitted'); // Popup message
        document.getElementById('scamReportForm').reset(); // Clear the form
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to submit report');
    });
});
