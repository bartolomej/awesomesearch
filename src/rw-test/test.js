import TestCase from "./test-case";


describe('TestCase class tests', function () {

  it('should calculate userName given repoUid', function () {
    const testCase = new TestCase('/someone/some-repo', 'README.md');
    expect(testCase.getUserName()).toEqual('someone');
  });

  it('should calculate repoName given repoUid', function () {
    const testCase = new TestCase('/someone/some-repo', 'README.md');
    expect(testCase.getRepoName()).toEqual('some-repo');
  });

  it('should calculate url given repoUid, readmePath', function () {
    const testCase = new TestCase('/someone/some-repo', 'README.md');
    expect(testCase.getUrl()).toEqual('https://github.com/someone/some-repo/README.md');
  });

  it('should calculate raw url given repoUid, readmePath', function () {
    const testCase = new TestCase('/someone/some-repo', 'README.md');
    expect(testCase.getRawUrl()).toEqual('https://raw.githubusercontent.com/someone/some-repo/master/README.md');
  });

});
