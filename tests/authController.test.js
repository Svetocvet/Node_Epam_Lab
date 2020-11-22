const assert = require('assert');
const {validateEmail, generatePassword} = require('../controllers/authController');

describe('Auth functions', function() {
    describe('validateEmail()', function() {
        it('should return false when email doesnt valid', function() {
            const email0 = 'testmail@gmail.com';
            const email1 = 'testmailgmail.com';
            const email2 = 'testmail@gmailcom';
            assert.equal(validateEmail(email0), true);
            assert.equal(validateEmail(email1), false);
            assert.equal(validateEmail(email2), false);
        });
    });
    describe('generatePassword()', function() {
        it('should return unique string with 8 char length', function() {
            const password0 = generatePassword();
            const password1 = generatePassword();
            const password2 = generatePassword();
            assert.equal(password0.length, password1.length);
            assert.equal(password1.length, password2.length);
            assert.equal(password2.length, 8);
            assert.notEqual(password0, password1);
            assert.notEqual(password1, password2);
        });
    });
});
