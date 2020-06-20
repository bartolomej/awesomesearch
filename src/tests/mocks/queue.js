function MockQueue () {
  let completedCb;
  let jobs = {};
  let queuedJobs = [];

  function on (name, cb) {
    if (name === 'global:completed') {
      completedCb = cb;
    }
  }

  async function add (name, data) {
    queuedJobs.push({ name, data });
  }

  async function getJob (id) {
    return jobs[id];
  }

  function _getQueuedJobs () {
    return queuedJobs;
  }

  function _setJob (id, job) {
    jobs[id] = job;
  }

  async function _completeJob (id, result) {
    // mock completed job
    await completedCb(id, result);
  }

  return { on, _completeJob, _setJob, getJob, add, _getQueuedJobs }
}

module.exports = MockQueue;
