'use strict';

describe('Flows E2E Tests:', function () {
  describe('Test Flows page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/flows');
      expect(element.all(by.repeater('flow in flows')).count()).toEqual(0);
    });
  });
});
