function fetchReports(sortBy = 'date', order = 'ASC') {
    fetch(`/reports?sort=${sortBy}&order=${order}`)
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('reportsContainer');
            container.innerHTML = '';
            data.data.forEach(report => {
                const reportDiv = document.createElement('div');
                reportDiv.innerHTML = `<strong onclick="showDetails(${report.id})">${report.title}</strong> - ${report.userName} - ${report.date}`;
                container.appendChild(reportDiv);
            });
        })
        .catch(error => console.error('Error:', error));
}

function showDetails(id) {
    fetch(`/reports/${id}`)
        .then(response => response.json())
        .then(data => {
            alert(`Title: ${data.data.title}\nDate: ${data.data.date}\nUsername: ${data.data.userName}\nType: ${data.data.scamType}\nDescription: ${data.data.description}\nPlatform: ${data.data.platform}`);
        })
        .catch(error => console.error('Error:', error));
}

window.onload = () => {
    fetchReports();
};
