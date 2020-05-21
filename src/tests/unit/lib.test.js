const { expect, it } =  require("@jest/globals");
const normalizeUrl = require('normalize-url');
const { performance, PerformanceObserver } = require('perf_hooks');


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

it('should normalize url', function () {
  const url1 = 'https://github.com/avelino/awesome-go#awesome-go';
  expect(normalizeUrl(url1, { stripHash: true })).toEqual('https://github.com/avelino/awesome-go');
});
