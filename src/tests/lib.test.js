const service = require('../services/metadata');
const fetchMock = require('fetch-mock');
const { performance, PerformanceObserver } = require('perf_hooks');


// LIBRARIES TESTS

it('should return error given invalid website url', async function () {
  fetchMock.get(
    'https://some-website.com', {
      throws: new Error('request to https://some-website.com failed, reason: getaddrinfo ENOTFOUND some-website.com')
    }
  );
  try {
    await service.getHtml('https://some-website.com');
    expect(1).toBe(2);
  } catch (e) {
    expect(e.message).toContain('failed');
  }
});

it('should calculate high precision execution duration in ms', function () {
  const start = performance.now();
  const end = performance.now();

  console.log(start, end);
  expect((end - start) > 0).toBeTruthy();
});

it('should measure performance in observer', function () {
  const obs = new PerformanceObserver((items) => {
    const name = items.getEntries()[0].name;
    const duration = items.getEntries()[0].duration;
    performance.clearMarks();

    expect(name).toEqual('A to B');
    expect(duration > 0).toBeTruthy();
  });
  obs.observe({ entryTypes: ['measure'] });

  performance.mark('A');
  performance.mark('B');
  performance.measure('A to B', 'A', 'B');
});
