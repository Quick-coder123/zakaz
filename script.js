// --- Дані відділень (витягнуто з Excel) ---
const branches = [
  { name: "Відділення №144/01 АБ \"УКРГАЗБАНК\"", address: "24400, Вінницька область, м. Бершадь, вул. Миколи Амосова, 4" },
  { name: "Відділення №220/01 АБ \"УКРГАЗБАНК\"", address: "21009, м. Вінниця, вул. Івана Бевза, 34" },
  { name: "Відділення №223/01 АБ \"УКРГАЗБАНК\"", address: "21018, м. Вінниця, вул. Р.Скалецького, 4" },
  /* … додайте інші філії … */
];

// Підтягуємо список відділень
const branchSelect = document.getElementById('branchSelect');
branches.forEach(br => {
  const opt = document.createElement('option');
  opt.value = br.name;
  opt.textContent = `${br.name}, ${br.address}`;
  branchSelect.appendChild(opt);
});

// Функція обчислення віку
function calculateAge(birthDateStr) {
  if (!birthDateStr) return null;
  const today = new Date();
  const birthDate = new Date(birthDateStr);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

// Елементи для динаміки полів
const birthDateInput         = document.getElementById('birthDate');
const passportType           = document.getElementById('passportType');
const bookFields             = document.getElementById('passportBookFields');
const idFields               = document.getElementById('passportIdFields');
const photoOptions           = document.getElementById('photoOptions');
const photo25Group           = document.getElementById('photo25').closest('.form-group');
const photo45Group           = document.getElementById('photo45').closest('.form-group');

// Нові елементи для логіки реєстрації/фактичного
const sameResidenceCheckbox  = document.getElementById('sameResidence');
const actualResidenceGroup   = document.getElementById('actualResidenceGroup');
const actualResidenceInput   = document.getElementById('actualResidence');

// Функція оновлення чекбоксів фото
function updatePhotoOptions() {
  const age = calculateAge(birthDateInput.value);
  if (passportType.value === 'book' && (age === 25 || age === 45)) {
    photoOptions.style.display   = 'block';
    photo25Group.style.display   = age === 25 ? 'block' : 'none';
    photo45Group.style.display   = age === 45 ? 'block' : 'none';
  } else {
    photoOptions.style.display = 'none';
  }
}

// Логіка показу полів паспорт/фото
passportType.addEventListener('change', () => {
  bookFields.style.display = passportType.value === 'book' ? 'block' : 'none';
  idFields.style.display   = passportType.value === 'id'   ? 'block' : 'none';
  updatePhotoOptions();
});
birthDateInput.addEventListener('change', updatePhotoOptions);

// Логіка приховування фактичного місця за чекбоксом
sameResidenceCheckbox.addEventListener('change', () => {
  if (sameResidenceCheckbox.checked) {
    actualResidenceGroup.style.display = 'none';
    actualResidenceInput.required      = false;
  } else {
    actualResidenceGroup.style.display = 'block';
    actualResidenceInput.required      = true;
  }
});

// Логіка місця отримання картки
const deliveryOpt = document.getElementById('deliveryOption');
const orgField    = document.getElementById('organizationField');
const brField     = document.getElementById('branchField');

deliveryOpt.addEventListener('change', () => {
  orgField.style.display = deliveryOpt.value === 'organization' ? 'block' : 'none';
  brField.style.display  = deliveryOpt.value === 'branch'       ? 'block' : 'none';
});

// Обробка відправки форми
document.getElementById('cardOrderForm').addEventListener('submit', e => {
  e.preventDefault();
  const data = new FormData(e.target);
  const result = {};
  data.forEach((v,k) => result[k] = v);
  console.log('Form data:', result);
  alert('Дані форми виведено в консоль. Реалізацію запиту на сервер можна додати тут.');
});
