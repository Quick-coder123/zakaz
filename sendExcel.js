// sendExcel.js
// Викликайте цю функцію після відправки форми для надсилання заявки на бекенд

async function sendExcelToBackend(formDataObj) {
  const response = await fetch('/api/send-excel', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formDataObj)
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Помилка надсилання заявки');
  }
  return await response.json();
}

// Для confirmation.html — надсилати заявку при завантаженні сторінки (або за кнопкою)
document.addEventListener('DOMContentLoaded', async function() {
  const formData = JSON.parse(localStorage.getItem('applicationData') || '{}');
  if (!formData || Object.keys(formData).length === 0) return;
  try {
    await sendExcelToBackend(formData);
    // Можна показати повідомлення про успіх
    document.getElementById('applicationData').insertAdjacentHTML('beforeend', '<p class="success">Заявку надіслано на e-mail!</p>');
  } catch (e) {
    document.getElementById('applicationData').insertAdjacentHTML('beforeend', `<p class="error">${e.message}</p>`);
  }
});
