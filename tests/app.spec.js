'use strict';
var expect = require('chai').expect;
var app = require('../app/app');
var chai = require('chai');
var sinon  = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);


describe('generateMessage without sinon.spy and sinon.stub', function ()
{
    it('should generate message when word is palindrome',function(){
        expect(app.generateMessage('ada')).to.eql({vowel:2, palindrome: true, message: 'ada is palindrome and has 2 vovels'})
        expect(app.generateMessage('www')).to.eql({vowel:0, palindrome: true, message: 'www is palindrome and has no vovels'})
    })

    it('should generate message when word is not palindrome',function(){
        expect(app.generateMessage('kot')).to.eql({vowel:1, palindrome: false, message: 'kot is not palindrome and has 1 vovels'})
        expect(app.generateMessage('asd')).to.eql({vowel:1, palindrome: false, message: 'asd is not palindrome and has 1 vovels'})
    })

    it('should throw expception when arguments are wrong', function(){
        expect(function(){app.generateMessage('')}).to.throw('Argument is undefined, not a string or empty string!');
        expect(function () {app.generateMessage('123456790').to.throw('Argument is undefined, not a string or empty string!');
        })
    })
});

describe('generateMessage with sinon.spy adn sinon.stub', function ()
{
    describe('spy', function ()
    {
        var callCountSpy;
        var isPalindromeSpy;
        before(function(){
            callCountSpy = sinon.spy(app, 'vowelCount');
            isPalindromeSpy = sinon.spy(app, 'isPalindrome');
            app.isPalindrome('qwerty');
            app.generateMessage('ada');

            app.generateMessage('my message');
        });

        after(function () {
            isPalindromeSpy.restore();
            callCountSpy.restore();
        });

        describe('callCount', function ()
        {
            it('should call callCount function twice',function() {
                expect(callCountSpy).callCount(2);
            })
        });
        describe('calledWith', function ()
        {
            it('should call isPalindrome function with \'qazx\' first time', function () {
                expect(isPalindromeSpy.getCall(0)).calledWith('qwerty');
            })

            it('should call isPalindrome function with \'ala\' second time',function(){
                expect(isPalindromeSpy.getCall(1)).calledWith('ada');
            })
        });
    });

    describe('stub', function ()
    {
        var isPalindromeStub;
        var generateMessageStub;
        var vovelCountStub;
        describe('returns', function () {

            before(function () {
                isPalindromeStub = sinon.stub(app, 'isPalindrome').returns(true);
                generateMessageStub = sinon.stub(app, 'generateMessage').returns({vowel: 8, palindrome: true, message: 'abc is palindrome and has 8 vovels'});
            });
            after(function () {
                isPalindromeStub.restore();
                generateMessageStub.restore();
            });

            it('should always return object with vowel count = 8, palindrome = true and message: abc is palindrome and has 8 vovels', function(){
                expect(app.generateMessage('qwerty')).to.eql({vowel:8, palindrome: true, message:'abc is palindrome and has 8 vovels'});
            })
        });
        describe('withArgs', function ()
        {
            before(function () {
                isPalindromeStub = sinon.stub(app, 'isPalindrome');
                isPalindromeStub.withArgs('ala').returns(false);
                isPalindromeStub.withArgs('qwert').returns(true);

                vovelCountStub = sinon.stub(app, 'vowelCount');
                vovelCountStub.withArgs('ala').returns(0);
                vovelCountStub.withArgs('qwert').returns(8);

            });
            after(function () {
                isPalindromeStub.restore();
                vovelCountStub.restore();
            });

            it('should return false, vovel count 0 and message',function(){
                expect(app.generateMessage('ala')).to.eql({vowel:0, palindrome: false, message: 'ala is not palindrome and has no vovels' })
            })

            it('should return true, vowel count 8 and message', function(){
                expect(app.generateMessage('qwert')).to.eql({vowel:8, palindrome: true, message:'qwert is palindrome and has 8 vovels'})
            })

        });
        describe('callsFake', function ()
        {
            var fakeMessageStub

            before(function () {
                fakeMessageStub = sinon.stub(app, 'generateMessage').callsFake(function (text) {
                    return({vowel:5, palindrome:false, message: "There is no message!"});
                });

            });
            after(function () {
                fakeMessageStub.restore();
            });

            it('should return false, vowel count 5 and message : There is no message!',function(){
                expect(app.generateMessage('ala')).to.eql({vowel:5, palindrome: false, message: "There is no message!"});
                expect(app.generateMessage('qwert')).to.eql({vowel:5, palindrome: false, message: "There is no message!"});
            })

        });
    });
});