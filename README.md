# Require Reviewer

Check for a user/group to have reviewed a pull request

## Inputs

### `whom`

**Required** Github user names or org groups. e.g. `username` or `@org/group`

## Outputs

### `missing`

Missing reviews from

## Example usage

uses: remind101/action-require-reviewer@v1
with:
  whom: 'username'
