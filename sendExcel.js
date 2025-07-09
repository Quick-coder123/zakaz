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
  let data;
  try {
    data = await response.json();
  } catch (e) {
    throw new Error('Сервер повернув невалідну відповідь. Спробуйте пізніше.');
  }
  if (!response.ok) {
    throw new Error(data && data.error ? data.error : 'Помилка надсилання заявки');
  }
  return data;
}

// Для confirmation.html — надсилати заявку при завантаженні сторінки (або за кнопкою)
document.addEventListener('DOMContentLoaded', async function() {
  const formData = JSON.parse(localStorage.getItem('applicationData') || '{}');
  if (!formData || Object.keys(formData).length === 0) return;
  const appDiv = document.getElementById('applicationData');
  // Показати анімований індикатор відправки
  appDiv.insertAdjacentHTML('beforeend', `
    <div id="sendingStatus" class="spinner-container fade-in">
      <div class="spinner"></div>
      <span>Відправка заявки...</span>
    </div>
  `);
  try {
    await sendExcelToBackend(formData);
    document.getElementById('sendingStatus').remove();
    appDiv.insertAdjacentHTML('beforeend', '<p class="success fade-in"><span class="icon-success">✔</span> Заявка успішно відправлена на e-mail!</p>');
  } catch (e) {
    document.getElementById('sendingStatus').remove();
    appDiv.insertAdjacentHTML('beforeend', `<p class="error fade-in"><span class="icon-error">✖</span> ${e.message}</p>`);
  }
});
