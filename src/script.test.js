import script from "./script";

describe('Script tests', function () {

  it('should return Hello World', function () {
    expect(script()).toEqual('Hello World')
  });

});
