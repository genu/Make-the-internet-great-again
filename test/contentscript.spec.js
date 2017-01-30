import MakeTheInternetGreat from '../app/scripts.babel/contentscript';

var expect = require('chai').expect;

describe('Content Script', function() {
  var _module, _fixtures;

  beforeEach(function() {
    _module = MakeTheInternetGreat();
    _fixtures = 'some fixtures here';
  });

  it('should have loaded the quotes', function() {
  });

  it('should test a string', function() {
  });

  it('should capitalize a string', function() {
  });

  it('should spurgeonize an element', function() {
  });
});
