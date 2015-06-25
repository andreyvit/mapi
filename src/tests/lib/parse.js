import parse from '../../lib/parse';
import { assert } from 'chai';
import mocha from 'mocha';

describe('Parse Tests', function() {

  it('Test the host parsing', function() {
    var testCases = [
      // Basic test
      { testValue: 'freep.com', result: 'freep' },
      { testValue: 'http://freep.com', result: 'freep' },
      { testValue: 'http://www.freep.com', result: 'freep' },
      { testValue: 'www.freep.com', result: 'freep' },

      // More complex
      { testValue: 'http://www.test.freep.com', result: 'test.freep' },
      { testValue: 'http://asdfasdf', result: 'asdfasdf' },
      { testValue: 'this.that.somedomain', result: 'this.that' },
      { testValue: 'somekinda.comlextest', result: 'somekinda' },

      // Invalid values
      { testValue: [], result: '' },
      { testValue: {}, result: '' },
      { testValue: 123123, result: '' }
    ];

    for (var i = 0; i < testCases.length; i++) {
      var testCase = testCases[i];

      var result = parse.stripHost(testCase.testValue);
      assert.equal(result, testCase.result);
    }
  });
});