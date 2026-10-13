const { sha256 } = require('../src/crypto');

describe('crypto.sha256', () => {
  test('hashes utf8 string to known hex digest', () => {
    // echo -n 'login:secret' | sha256sum
    expect(sha256('login:secret')).toBe(
      '41c775842fc4c681c81a59f0b0799788e8b618dc3428101b48bc166919400d07'
    );
  });

  test('same input yields same digest', () => {
    expect(sha256('a')).toBe(sha256('a'));
  });

  test('different input yields different digest', () => {
    expect(sha256('a')).not.toBe(sha256('b'));
  });
});
