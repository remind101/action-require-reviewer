# Require Reviewer

Check for a user/group to have reviewed a pull request

## Inputs

### `whoms`

**Required** Github user names or org groups. e.g. `username` or `@org/group`

### `GITHUB_TOKEN`

**Required** A token with the following permissions is required for organization related checks: `read:org` and `repo:status`

### `SKIP`

A common separated list of text to match in the pull body, which will skip this action if found.

## Outputs

### `missing`

Missing reviews from

## Example usage

Add an auth token with the correct permissions (see above) to your secrets as `AUTH_GITHUB_TOKEN`

```
on: ['pull_request','pull_request_review]

jobs:
  require_review:
    runs-on: ubuntu-latest
    name: Requires Review
    steps:
    - name: Check reviewers
      uses: remind101/action-require-reviewer@v1
      with:
        whoms: "user,@team"
        skip: "skip-review","skipreview"
        GITHUB_TOKEN: ${{ secrets.AUTH_GITHUB_TOKEN }}
```
