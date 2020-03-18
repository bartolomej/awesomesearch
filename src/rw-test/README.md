# Real world tests

These tests run awesome-list parsing algorithm on real world data.
Test results are cached in `/results.json` file.
<br>
Following things happen when running test:
- README.md file is downloaded in `/out/<list-name>`
- Abstract Syntax Tree is written to `tree.json` and `tree.txt` files
- when content from `README.md` is parsed two things can happen:
    - parsed output is written to `document.json`
    - parse error report is written to `report.txt`

<b>IMPORTANT: manually verify parse results before committing `results.json` file!</b>

## Cli

> TIP: provide `--break` flag to stop execution on exception.

#### 1. Run tests on new repositories

If you want to execute tests on new repositories, provide a `test.config.json` 
file in root with the following format:
```json
[
  {
    "uid": "/<username>/<repository-name>/",
    "readmePath": "/readme.md"
  }
]

```

Execute tests on following repositories with the following command:
```bash
npm run build && node build/rw-test/cli.js rw-test --config
```

#### 2. Rerun failed cases

Rerun real world parsing test on failed test cases:
```bash
npm run build && node build/rw-test/cli.js rw-test --failed
```

#### 3. Rerun all cases

Rerun real world parsing test on failed test cases:
```bash
npm run build && node build/rw-test/cli.js rw-test
```
