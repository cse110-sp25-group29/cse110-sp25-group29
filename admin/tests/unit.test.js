import { isPhoneNumber } from '../test-functions/unit';
test('adds 1 + 2 to equal 3', () => {
  expect(1 + 2).toBe(3);
});
// isPhoneNumber True
test('Good phone number 1', () => {
  expect(isPhoneNumber('(510)111-1111')).toBe(true);
});

test('Good phone number 2', () => {
  expect(isPhoneNumber('111-9999')).toBe(true);
});

// isPhoneNumber False
test('Bad phone number 1', () => {
  expect(isPhoneNumber('1 11-1111')).toBe(false);
});

test('Bad phone number 2', () => {
  expect(isPhoneNumber('blah blah blah')).toBe(false);
});
