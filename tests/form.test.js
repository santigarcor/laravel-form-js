let Form = require('../src/Form');
let moxios = require('moxios');

test('can create a form with data, method (optional) and clearAfterResponse (optional)', () => {
  let form = Form.makeFrom({name: 'test'}, 'post', false);

  expect(form.name).toBeDefined();
  expect(form.method).toBeDefined();
  expect(form.clearAfterResponse).toBeDefined();
  expect(form.errors).toBeDefined();

  expect(form.name).toBe('test');
  expect(form.method).toBe('post');
  expect(form.clearAfterResponse).toBe(false);
});

test('after initializing the form it has an originalData object', () => {
  let form = Form.makeFrom({name: 'test'});
  expect(form.originalData).toBeDefined();
  expect(form.originalData).toEqual({name: 'test'});
});

test('can reset the form data to its original data state', () => {
  let form = Form.makeFrom({name: 'test'});
  form.name = 'new name';
  expect(form.name).toBe('new name');
  form.reset();
  expect(form.name).toBe('test');
});

test('if the original data has an object it doesnt change the original data', () => {
  let form = Form.makeFrom({name: {text: 'name'}});
  form.name.text = 'new name';
  expect(form.name).toEqual({text: 'new name'});
  expect(form.originalData.name).toEqual({text: 'name'});
  form.reset();
  expect(form.name).toEqual({text: 'name'});
});

test('can change the form http method', () => {
  let form = Form.makeFrom({name: 'test'});
  form.name = 'new name';
  expect(form.name).toBe('new name');
  form.reset();
  expect(form.name).toBe('test');
});

test('can retrieve the errors for a specific field', () => {
  let form = Form.makeFrom({name: 'test'});

  form.errors.errors['name'] = ['Woops error'];
  expect(form.errorsFor('name')).toBe('Woops error');
});


test('it retrieves the form data as a json', () => {
  let form = Form.makeFrom({name: 'test', email: 'test@mail.com'}, 'put');

  expect(form.data('json')).toEqual({name: 'test', email: 'test@mail.com', _method: 'put'});
});

test('it retrieves the form data as a FormData', () => {
  let form = Form.makeFrom({name: 'test', email: 'test@mail.com'}, 'patch');

  let data = form.data('form-data');
  expect(data.get('name') == form.name).toBeTruthy();
  expect(data.get('email') == form.email).toBeTruthy();
  expect(data.get('_method') == form.method).toBeTruthy();
});

test('can submit the form and use promises to receive the results', () => {
  let form = Form.makeFrom({name: 'test', email: 'test@mail.com'}, 'post');
  moxios.install(form.axios);

  moxios.wait(function () {
    moxios.requests.mostRecent().respondWith({
      status: 200,
      response: 'done'
    });
  });

  return form.submit('url').then(response => {
    expect(response.data).toBe("done");
    moxios.uninstall(form.axios);
  });
});

test('can submit the form and use promises to receive the validation errors', () => {
  let form = Form.makeFrom({name: 'test', email: 'test@mail.com'}, 'post');
  moxios.install(form.axios);

  moxios.wait(function () {
    moxios.requests.mostRecent().respondWith({
      status: 422,
      response: { errors: { name: ['failed'] } }
    });
  });

  return form.submit('url').catch(error => {
    expect(form.errorsFor('name')).toBe("failed");
    moxios.uninstall(form.axios);
  });
});
