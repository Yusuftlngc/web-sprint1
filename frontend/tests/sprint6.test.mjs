import assert from 'node:assert/strict';
import { after, afterEach, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import React, { act } from 'react';
import { JSDOM } from 'jsdom';
import { createServer } from 'vite';
import { BrowserRouter } from 'react-router-dom';

const dom = new JSDOM('<!doctype html><html><body><div id="test-root"></div></body></html>', {
  url: 'http://localhost:5173/'
});
for (const key of ['window', 'document', 'HTMLElement', 'HTMLInputElement', 'HTMLSelectElement', 'HTMLTextAreaElement', 'Event', 'MouseEvent', 'PopStateEvent', 'FormData']) {
  globalThis[key] = dom.window[key];
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { createRoot } = await import('react-dom/client');
const server = await createServer({
  root: fileURLToPath(new URL('..', import.meta.url)),
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error'
});
const { default: App } = await server.ssrLoadModule('/src/App.tsx');
const { EventsProvider, useEvents } = await server.ssrLoadModule('/src/context/EventsContext.tsx');
const { validateEvent } = await server.ssrLoadModule('/src/utils/validate-event.ts');
const { events: initialEvents } = await server.ssrLoadModule('/src/data/events.ts');
const originalData = JSON.stringify(initialEvents);
const container = document.getElementById('test-root');
let root;

async function mount(path = '/', child = React.createElement(App)) {
  if (root) await act(() => root.unmount());
  window.history.replaceState(null, '', path);
  window.confirm = () => false;
  root = createRoot(container);
  await act(() => root.render(React.createElement(BrowserRouter, null,
    React.createElement(EventsProvider, null, child))));
}

async function route(path) {
  await act(() => {
    window.history.pushState(null, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  });
}

function control(name) {
  const field = container.querySelector(`[name="${name}"]`);
  assert(field, `Missing field ${name}`);
  return field;
}

async function fill(name, value) {
  const field = control(name);
  const prototype = field instanceof HTMLSelectElement ? HTMLSelectElement.prototype
    : field instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  await act(() => {
    Object.getOwnPropertyDescriptor(prototype, 'value').set.call(field, value);
    field.dispatchEvent(new Event(field instanceof HTMLSelectElement ? 'change' : 'input', { bubbles: true }));
  });
}

async function click(element) {
  assert(element, 'Missing clickable element');
  await act(() => element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 })));
}

function link(label) {
  const element = [...container.querySelectorAll('a')].find(a => a.textContent.trim() === label);
  assert(element, `Missing link ${label}`);
  return element;
}

async function submit() { await click(container.querySelector('form button[type="submit"]')); }
const errors = () => container.querySelectorAll('.hata-metni');
const validData = { title: 'Yeni Etkinlik', category: 'Atölye', date: '2026-01-01', time: '12:00', location: 'Lab 1', capacity: '25', description: 'Birlikte öğrenme ve uygulama etkinliği.' };

afterEach(async () => {
  if (root) { await act(() => root.unmount()); root = undefined; }
  assert.equal(JSON.stringify(initialEvents), originalData, 'Initial data must remain unchanged');
});
after(async () => { await server.close(); dom.window.close(); });

test('Event validation: seven empty errors, whitespace and capacity boundaries', () => {
  const empty = Object.fromEntries(Object.keys(validData).map(key => [key, '']));
  assert.equal(Object.keys(validateEvent(empty)).length, 7);
  assert.deepEqual(validateEvent(validData), {});
  for (const value of ['1', '1000']) assert.deepEqual(validateEvent({ ...validData, capacity: value }), {});
  for (const value of ['', '0', '-1', '1001', '1.5', 'abc', 'Infinity']) {
    assert(validateEvent({ ...validData, capacity: value }).capacity, `Invalid capacity accepted: ${value}`);
  }
  for (const key of ['title', 'location', 'description', 'date', 'time']) {
    assert(validateEvent({ ...validData, [key]: '  ' })[key], `Whitespace accepted: ${key}`);
  }
  assert(validateEvent({ ...validData, category: 'Geçersiz' }).category);
  assert(validateEvent({ ...validData, title: 'ab' }).title);
  assert.deepEqual(validateEvent({ ...validData, title: 'abc', description: '1234567890' }), {});
});

test('All ten routes, unknown event/edit IDs and active navigation', async () => {
  await mount();
  const cases = [
    ['/', 'Yaklaşan 2 Etkinlik', '/'], ['/events', 'Etkinlikler', '/events'],
    ['/events/event-2', 'Robotik Atölyesi', '/events'], ['/login', 'Giriş Yap', '/login'],
    ['/register', 'Kayıt Ol'], ['/forgot-password', 'Şifremi Unuttum'],
    ['/admin', 'Etkinlik Yönetimi', '/admin'], ['/admin/new', 'Etkinlik Ekle', '/admin'],
    ['/admin/event-2/edit', 'Etkinlik Güncelle', '/admin'], ['/xyz', 'Sayfa bulunamadı'],
    ['/events/yok', 'Sayfa bulunamadı', '/events'], ['/admin/yok/edit', 'Sayfa bulunamadı', '/admin']
  ];
  for (const [path, title, active] of cases) {
    await route(path);
    assert.equal(container.querySelector('.bolum-baslik').textContent, title, path);
    const current = container.querySelectorAll('nav a[aria-current="page"]');
    assert.equal(current.length, active ? 1 : 0, path);
    if (active) assert.equal(current[0].getAttribute('href'), active, path);
  }
  await click(link('Ana sayfaya dön'));
  assert.equal(window.location.pathname, '/');
  assert.equal(container.querySelectorAll('.kart').length, 2);
});

test('Search, category filter, combined filtering, empty results and card links', async () => {
  await mount('/events');
  assert.equal(container.querySelectorAll('.kart').length, 6);
  await fill('search', 'ROBOTİK');
  assert.equal(container.querySelectorAll('.kart').length, 1);
  await click(link('Detayları gör'));
  assert.equal(window.location.pathname, '/events/event-2');
  await click(link('Listeye dön'));
  await fill('category', 'Atölye');
  assert.equal(container.querySelectorAll('.kart').length, 2);
  await fill('search', 'Web');
  assert.equal(container.querySelectorAll('.kart').length, 1);
  await fill('search', 'bulunmayan');
  assert.equal(container.querySelectorAll('.kart').length, 0);
  assert(container.textContent.includes('Aramanıza uygun etkinlik bulunamadı.'));
});

test('Empty event form shows all seven inline errors and never saves', async () => {
  await mount('/admin/new');
  await submit();
  assert.equal(errors().length, 7);
  assert.equal(container.querySelectorAll('[aria-invalid="true"]').length, 7);
  assert.equal(document.activeElement.name, 'title');
  assert.equal(window.location.pathname, '/admin/new');
  for (const [name, value] of Object.entries(validData)) await fill(name, value);
  await fill('capacity', '1.5');
  await submit();
  assert.equal(errors().length, 1);
  assert.equal(control('capacity').getAttribute('aria-invalid'), 'true');
});

test('Create/edit/delete propagate across pages; delete cancellation; empty table; refresh reset', async () => {
  await mount('/admin');
  assert.equal(container.querySelectorAll('tbody tr').length, 6);
  await click(link('+ Yeni etkinlik'));
  for (const [name, value] of Object.entries({ ...validData, title: '  Yeni Test Etkinliği  ', location: '  Lab 1  ' })) await fill(name, value);
  await submit();
  assert.equal(window.location.pathname, '/admin');
  assert.equal(container.querySelectorAll('tbody tr').length, 7);
  let row = [...container.querySelectorAll('tbody tr')].find(r => r.textContent.includes('Yeni Test Etkinliği'));
  const editPath = row.querySelector('a').getAttribute('href');
  const id = editPath.split('/')[2];
  await click(link('Ana Sayfa'));
  assert(container.textContent.includes('Yeni Test Etkinliği'));
  await click(link('Etkinlikler'));
  assert.equal(container.querySelectorAll('.kart').length, 7);
  await click([...container.querySelectorAll('.kart')].find(card => card.textContent.includes('Yeni Test Etkinliği')).querySelector('a'));
  assert.equal(window.location.pathname, `/events/${id}`);
  assert(container.textContent.includes('Lab 1'));
  await click(link('Bu etkinliği güncelle'));
  assert.equal(control('title').value, 'Yeni Test Etkinliği');
  assert.equal(control('capacity').value, '25');
  await fill('title', 'Güncellenen Test Etkinliği');
  await fill('capacity', '1000');
  await submit();
  assert.equal(window.location.pathname, '/admin');
  await click(link('Ana Sayfa'));
  assert(container.textContent.includes('Güncellenen Test Etkinliği'));
  await route(`/events/${id}`);
  assert(container.textContent.includes('1000 kişi'));
  await click(link('Yönetim'));
  row = [...container.querySelectorAll('tbody tr')].find(r => r.textContent.includes('Güncellenen Test Etkinliği'));
  let confirmations = 0;
  window.confirm = message => { confirmations++; assert(message.includes('Güncellenen Test Etkinliği')); return false; };
  await click(row.querySelector('button'));
  assert.equal(confirmations, 1);
  assert.equal(container.querySelectorAll('tbody tr').length, 7);
  window.confirm = () => true;
  await click(row.querySelector('button'));
  assert.equal(container.querySelectorAll('tbody tr').length, 6);
  await click(link('Ana Sayfa'));
  assert(!container.textContent.includes('Güncellenen Test Etkinliği'));
  await click(link('Etkinlikler'));
  assert.equal(container.querySelectorAll('.kart').length, 6);
  await route(`/events/${id}`);
  assert.equal(container.querySelector('.bolum-baslik').textContent, 'Sayfa bulunamadı');
  await click(link('Yönetim'));
  while (container.querySelector('tbody button')) await click(container.querySelector('tbody button'));
  assert(container.textContent.includes('Henüz etkinlik yok.'));
  await click(link('Etkinlikler'));
  assert.equal(container.querySelectorAll('.kart').length, 0);
  await mount('/admin');
  assert.equal(container.querySelectorAll('tbody tr').length, 6, 'Remount must restore initial data');
});

test('Changing edit URL resets form to the selected event; editing preserves its poster', async () => {
  await mount('/admin/event-1/edit');
  assert.equal(control('title').value, initialEvents[0].title);
  await route('/admin/event-2/edit');
  assert.equal(control('title').value, initialEvents[1].title);
  await fill('title', 'Robotik Atölyesi Güncel');
  await submit();
  await route('/events/event-2');
  assert.equal(container.querySelector('img').getAttribute('src'), '/afis.svg');
  assert.equal(container.querySelector('.bolum-baslik').textContent, 'Robotik Atölyesi Güncel');
});

test('Context functional updates keep multiple queued operations and unique IDs', async () => {
  let state;
  function Probe() { state = useEvents(); return null; }
  await mount('/', React.createElement(Probe));
  await act(() => {
    state.addEvent(validData);
    state.addEvent({ ...validData, title: 'İkinci Yeni Etkinlik' });
    state.updateEvent('event-2', { ...validData, title: 'Güncel Robotik' });
    state.deleteEvent('event-1');
  });
  assert.equal(state.events.length, 7);
  assert.equal(new Set(state.events.map(event => event.id)).size, 7);
  assert(!state.events.some(event => event.id === 'event-1'));
  assert.equal(state.events.find(event => event.id === 'event-2').title, 'Güncel Robotik');
  assert.equal(state.events.find(event => event.id === 'event-2').capacity, 25);
});

test('Login, registration and password reset validate inputs and display demo messages', async () => {
  await mount('/login');
  await submit();
  assert.equal(errors().length, 2);
  await fill('email', 'ogrenci@example.com');
  await fill('password', '12345');
  await submit();
  assert.equal(errors().length, 1);
  await fill('password', '123456');
  await submit();
  assert.equal(errors().length, 0);
  assert(container.querySelector('[role="status"]').textContent.includes('Gerçek giriş Sprint 10'));
  await fill('password', '');
  assert.equal(container.querySelector('[role="status"]'), null);
  await click(link('Hesabın yok mu? Kayıt ol'));
  await submit();
  assert.equal(errors().length, 4);
  await fill('name', 'Ali Veli');
  await fill('email', 'ogrenci@example.com');
  await fill('password', '123456');
  await fill('password2', '654321');
  await submit();
  assert.equal(errors().length, 1);
  assert(errors()[0].textContent.includes('Şifreler aynı değil'));
  await fill('password2', '123456');
  await submit();
  assert.equal(errors().length, 0);
  assert(container.querySelector('[role="status"]').textContent.includes('Gerçek kayıt'));
  await click(link('Zaten hesabın var mı? Giriş yap'));
  await click(link('Şifremi unuttum'));
  await submit();
  assert.equal(errors().length, 1);
  await fill('email', 'ogrenci@example.com');
  await submit();
  assert.equal(errors().length, 0);
  assert(container.querySelector('[role="status"]').textContent.includes('ogrenci@example.com adresine gönderildi (demo)'));
  await click(link('← Girişe dön'));
  assert.equal(window.location.pathname, '/login');
});
