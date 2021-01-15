# Require Reviewer

Check for a user/group to have reviewed a pull request

## Inputs

### `whoms`

**Required** Github user names or org groups. e.g. `username` or `@org/group`

### `GITHUB_TOKEN`

**Required** A token with the following permissions is required for organization related checks: `read:org` and `repo:status`

## Outputs

### `missing`

Missing reviews from

## Example usage

Add an auth token with the correct permissions (see above) to your secrets as `AUTH_GITHUB_TOKEN` 

```
on: ['pull_request']

jobs:
  require_review:
    runs-on: ubuntu-latest
    name: Requires Review
    steps:
    - name: Check
      uses: remind101/action-require-reviewer@v1
      with:
        whoms: user,@team
        GITHUB_TOKEN: ${{ secrets.AUTH_GITHUB_TOKEN }}
```
