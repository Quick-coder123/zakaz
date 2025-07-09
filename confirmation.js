// confirmation.js
// Відображає дані заявки, передані через localStorage

document.addEventListener('DOMContentLoaded', function() {
  const dataDiv = document.getElementById('applicationData');
  const formData = JSON.parse(localStorage.getItem('applicationData') || '{}');
  if (!formData || Object.keys(formData).length === 0) {
    dataDiv.innerHTML = '<p>Дані заявки не знайдено.</p>';
    return;
  }
  let html = '<ul class="confirmation-list">';
  for (const [key, value] of Object.entries(formData)) {
    html += `<li><strong>${key}:</strong> ${value}</li>`;
  }
  html += '</ul>';
  dataDiv.innerHTML = html;
});
