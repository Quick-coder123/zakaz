  // --- Обробка відправки форми ---
  const form = document.getElementById('cardOrderForm');
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(form);
    const data = {};
    for (const [key, value] of formData.entries()) {
      // Для чекбоксів true/false
      const el = form.elements[key];
      if (el && el.type === 'checkbox') {
        data[key] = el.checked ? 'Так' : 'Ні';
      } else {
        data[key] = value;
      }
    }
    // Зберігаємо у localStorage
    localStorage.setItem('applicationData', JSON.stringify(data));
    // Переходимо на сторінку підтвердження
    window.location.href = 'confirmation.html';
  });
document.addEventListener('DOMContentLoaded', function() {
  // Сховати чекбокс "Хочу отримати картку на організації", якщо вибрано "На організації"
  const orgYesCheckbox = document.getElementById('orgYes');
  const orgYesLabel = orgYesCheckbox ? orgYesCheckbox.nextElementSibling : null;

  // Логіка місця отримання картки
  const deliveryOpt = document.getElementById('deliveryOption');
  const orgField    = document.getElementById('organizationField');
  const brField     = document.getElementById('branchField');

  function updateOrgYesVisibility() {
    if (deliveryOpt.value === 'organization') {
      if (orgYesCheckbox) orgYesCheckbox.style.display = 'none';
      if (orgYesLabel) orgYesLabel.style.display = 'none';
    } else {
      if (orgYesCheckbox) orgYesCheckbox.style.display = '';
      if (orgYesLabel) orgYesLabel.style.display = '';
    }
  }

  deliveryOpt.addEventListener('change', () => {
    orgField.style.display = deliveryOpt.value === 'organization' ? 'block' : 'none';
    brField.style.display  = deliveryOpt.value === 'branch'       ? 'block' : 'none';
    updateOrgYesVisibility();
  });
  updateOrgYesVisibility();

  // --- Динамічне завантаження відділень з CSV ---
  const citySelect = document.getElementById('citySelect');
  let cityChoices;
  const citySearch = document.getElementById('citySearch');
  const branchSelect = document.getElementById('branchSelect');
  let branchChoices;
  let branches = [];

  let allCities = [];
  fetch('branches.csv')
    .then(response => response.text())
    .then(text => {
      const lines = text.trim().split('\n');
      const header = lines[0].split(',');
      branches = lines.slice(1).map(line => {
        const cols = line.split(',');
        return {
          region: cols[0],
          city: cols[1],
          number: cols[2],
          address: cols.slice(3).join(',')
        };
      });
      allCities = Array.from(new Set(branches.map(b => b.city)));
      renderCityOptions(allCities);
      if (window.Choices) {
        if (cityChoices) cityChoices.destroy();
        cityChoices = new Choices(citySelect, {
          searchEnabled: true,
          itemSelectText: '',
          shouldSort: true,
          placeholder: true,
          placeholderValue: 'Оберіть місто',
          noResultsText: 'Місто не знайдено',
          fuseOptions: {
            threshold: 0.0, // тільки повне співпадіння початку слова
            keys: ['label', 'value']
          },
          searchResultLimit: 100,
          searchFields: ['label', 'value'],
          sorter: (a, b) => 0 // не сортувати додатково
        });

        // Додаємо додаткову фільтрацію для точного співпадіння з початку
        citySelect.choices.config.shouldSort = false;
        citySelect.choices.config.searchFn = function(items, searchValue) {
          if (!searchValue) return items;
          const val = searchValue.toLowerCase();
          return items.filter(item => item.label.toLowerCase().startsWith(val));
        };
      }
    });

  function renderCityOptions(cities) {
    citySelect.innerHTML = '<option value="">Оберіть місто</option>';
    cities.forEach(city => {
      const opt = document.createElement('option');
      opt.value = city;
      opt.textContent = city;
      citySelect.appendChild(opt);
    });
  }

  // Пошук тепер реалізує Choices.js

  function updateBranchOptions() {
    branchSelect.innerHTML = '<option value="">Оберіть відділення</option>';
    const selectedCity = citySelect.value;
    if (!selectedCity) {
      if (branchChoices) branchChoices.clearStore();
      return;
    }
    const filteredBranches = branches.filter(b => b.city === selectedCity);
    filteredBranches.forEach(br => {
      const opt = document.createElement('option');
      opt.value = br.number;
      opt.textContent = `№${br.number}, ${br.address}`;
      branchSelect.appendChild(opt);
    });
    // ініціалізуємо/оновлюємо Choices для branchSelect
    if (window.Choices) {
      if (branchChoices) branchChoices.destroy();
      branchChoices = new Choices(branchSelect, {
        searchEnabled: true,
        itemSelectText: '',
        shouldSort: false,
        placeholder: true,
        placeholderValue: 'Оберіть відділення',
        noResultsText: 'Відділення не знайдено',
        fuseOptions: {
          threshold: 0.0,
          keys: ['label', 'value']
        },
        searchResultLimit: 100,
        searchFields: ['label', 'value'],
        sorter: (a, b) => 0
      });
      branchSelect.choices.config.shouldSort = false;
      branchSelect.choices.config.searchFn = function(items, searchValue) {
        if (!searchValue) return items;
        const val = searchValue.toLowerCase();
        return items.filter(item => item.label.toLowerCase().startsWith(val));
      };
    }
  }

  citySelect.addEventListener('change', updateBranchOptions);

  // --- Далі ваш існуючий код (чекбокси, паспорт, місце проживання тощо) ---
  // Нові елементи для логіки реєстрації/фактичного
  const sameResidenceCheckbox  = document.getElementById('sameResidence');
  const workPlaceGroup   = document.getElementById('workPlaceGroup');
  const workPlaceInput   = document.getElementById('workPlace');

  sameResidenceCheckbox.addEventListener('change', () => {
    if (sameResidenceCheckbox.checked) {
      workPlaceGroup.classList.add('hidden');
      workPlaceInput.required = false;
    } else {
      workPlaceGroup.classList.remove('hidden');
      workPlaceInput.required = true;
    }
  });
  if (sameResidenceCheckbox.checked) {
    workPlaceGroup.classList.add('hidden');
    workPlaceInput.required = false;
  } else {
    workPlaceGroup.classList.remove('hidden');
    workPlaceInput.required = true;
  }

  // --- Паспорт/фото ---
  const passportType = document.getElementById('passportType');
  const passportBookFields = document.getElementById('passportBookFields');
  const idFields = document.getElementById('passportIdFields');
  const photoOptions = document.getElementById('photoOptions');
  const photo25Group = document.getElementById('photo25')?.parentElement;
  const photo45Group = document.getElementById('photo45')?.parentElement;
  const birthDateInput = document.getElementById('birthDate');

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

  function updatePhotoOptions() {
    const age = calculateAge(birthDateInput.value);
    if (passportType.value === 'book' && (age === 25 || age === 45)) {
      photoOptions.style.display   = 'block';
      if (photo25Group) photo25Group.style.display   = age === 25 ? 'block' : 'none';
      if (photo45Group) photo45Group.style.display   = age === 45 ? 'block' : 'none';
    } else {
      photoOptions.style.display = 'none';
    }
  }

  passportType.addEventListener('change', () => {
    passportBookFields.style.display = passportType.value === 'book' ? 'block' : 'none';
    idFields.style.display   = passportType.value === 'id'   ? 'block' : 'none';
    updatePhotoOptions();
  });
  birthDateInput.addEventListener('change', updatePhotoOptions);
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
const workPlaceGroup   = document.getElementById('workPlaceGroup');
const workPlaceInput   = document.getElementById('workPlace');

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
    workPlaceGroup.classList.add('hidden');
    workPlaceInput.required = false;
  } else {
    workPlaceGroup.classList.remove('hidden');
    workPlaceInput.required = true;
  }
});

// При завантаженні сторінки одразу застосувати стан чекбокса
if (sameResidenceCheckbox.checked) {
  workPlaceGroup.classList.add('hidden');
  workPlaceInput.required = false;
} else {
  workPlaceGroup.classList.remove('hidden');
  workPlaceInput.required = true;
}

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
