import { firstUpperLetter } from './helper.js';

const eventsContainer = document.querySelector('.allevents-container');
const filterContainer = document.querySelector('.filter-container');
const addEventBtn = document.querySelector('.add-event-btn');

const btnCloseModal = document.querySelector('.btn--close-modal');
const overlay = document.querySelector('.overlay');
const formWindow = document.querySelector('.form-window');
const addEventForm = document.querySelector('.upload');
const uploadBtn = document.querySelector('.upload__btn');

export const generateEventsMarkup = function (event) {
  const [...dates] = event.dates;
  const eventsNearDate = dates.join('').slice(0, 10).replaceAll('-', '/');
  const localeDate = new Date(eventsNearDate).toLocaleDateString();
  return `
    <div class="single-event-container">
      <img src="${event.imgURL}" alt="${event.title}">
      <h2>${event.title}</h2>
      <p class="event-desc">${event.description}</p>
      <p class="event-dates">${localeDate}</p>
      <button class="btn-icon edit-icon"><i class="far fa-edit"></i></button>
      <button class="btn-icon trash-icon"><i class="fas fa-trash-alt"></i></button>
    </div>`;
};

export const render = function (markup) {
  if (!eventsContainer || !markup) return;
  eventsContainer.insertAdjacentHTML('beforeend', markup);
};

export const generateFilterMarkup = function (events) {
  if (!events) return;
  let buttons = '<button class="btn-filter btn-all-events">All events</button>';
  const uniqueEventTypes = [...new Set(events.map(event => event.type))];
  uniqueEventTypes.forEach(eventType => {
    buttons += `
    <button class="btn-filter btn-${eventType}">${firstUpperLetter(
      eventType
    )}</button>
    `;
  });
  return buttons;
};

export const renderFilterButtons = function (markup) {
  if (!filterContainer || !markup) return;
  filterContainer.insertAdjacentHTML('afterbegin', markup);
};

export const filterHandler = function (events) {
  if (!filterContainer) return;
  filterContainer.addEventListener('click', e => {
    const btn = e.target.closest('.btn-filter');
    if (!btn) return;
    if (btn.classList.contains('btn-all-events')) {
      eventsContainer.innerHTML = '';
      events.forEach(event => render(generateEventsMarkup(event)));
    } else if (btn.classList.contains('btn-dance')) {
      eventsContainer.innerHTML = '';
      const danceEvents = filterEventsByType(events, 'dance');
      danceEvents.forEach(event => render(generateEventsMarkup(event)));
    } else if (btn.classList.contains('btn-concert')) {
      eventsContainer.innerHTML = '';
      const concertEvents = filterEventsByType(events, 'concert');
      concertEvents.forEach(event => render(generateEventsMarkup(event)));
    } else if (btn.classList.contains('btn-opera')) {
      eventsContainer.innerHTML = '';
      const operaEvents = filterEventsByType(events, 'opera');
      operaEvents.forEach(event => render(generateEventsMarkup(event)));
    }
  });
};

const filterEventsByType = function (events, type) {
  return events.filter(event => event.type === type);
};

const toggleWindow = function () {
  if (!overlay || !formWindow) return;
  overlay.classList.toggle('hidden');
  formWindow.classList.toggle('hidden');
};

const addHandlerShowForm = function () {
  if (!addEventBtn) return;
  addEventBtn.addEventListener('click', toggleWindow);
};
addHandlerShowForm();

const addHandlerHideForm = function () {
  if (!btnCloseModal) return;
  btnCloseModal.addEventListener('click', toggleWindow);
  overlay.addEventListener('click', toggleWindow);
};
addHandlerHideForm();

const uploadBtnHandler = function () {
  if (!eventsContainer || !uploadBtn) return;
  uploadBtn.addEventListener('click', e => {
    e.preventDefault();
    uploadEvent();
  });
};
uploadBtnHandler();

const uploadEvent = function () {
  console.log('joijoi');
  const formData = getFormData();
  const markup = generateEventsMarkup(formData);
  eventsContainer.insertAdjacentHTML('afterbegin', markup);
  toggleWindow();
};

const getFormData = function () {
  const formData = new FormData(addEventForm);
  if (!formData) return;
  const data = Object.fromEntries(formData);
  return data;
};

const eventHandler = function () {
  if (!eventsContainer) return;
  eventsContainer.addEventListener('click', e => {
    const btn = e.target.closest('.btn-icon');
    if (!btn) return;
    if (btn.classList.contains('trash-icon')) {
      deleteEvent(btn);
    } else if (btn.classList.contains('edit-icon')) {
      toggleWindow();
      deleteEvent(btn);
    }
  });
};
eventHandler();

const deleteEvent = function (elem) {
  elem.parentElement.outerHTML = '';
};
