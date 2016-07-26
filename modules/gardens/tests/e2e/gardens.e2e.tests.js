'use strict';

describe('Gardens E2E Tests:', function () {
  describe('Test Gardens page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/gardens');
      expect(element.all(by.repeater('garden in gardens')).count()).toEqual(0);
    });
  });
});
