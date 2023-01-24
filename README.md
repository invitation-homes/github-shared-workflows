# Github Shared Workflows
Repository for GitHub actions and workflows that are intended to be shared across the Invitation Homes organization.

## Workflows

### terraform-lint
This workflow takes a specified directory or comma-separated list of directories and runs:
* terraform fmt -check
* tfsec with [custom rules](https://github.com/invitation-homes/terraform-linting-rules)
* tflint with [custom rules](https://github.com/invitation-homes/terraform-linting-rules/blob/main/.tflint.hcl)

#### Application Repo Example
```yaml
on: [pull_request]

jobs:
  terraform-lint:
    uses: invitation-homes/github-shared-workflows/.github/workflows/terraform-lint.yml@v1
    secrets: inherit
    with:
      directories: ./terraform
```

#### Mono Repo Example
```yaml
on: [pull_request]

jobs:
  get-directories: # Job that list subdirectories
    runs-on: ubuntu-latest
    outputs:
      directories: ${{ steps.set-directories.outputs.directories }} # generate output name dir by using inner step output
    steps:
      - name: Clone Repo
        uses: actions/checkout@v3

      - name: Get main branch
        run: git fetch --no-tags --prune --depth=1 origin +refs/heads/main:refs/remotes/origin/main

      - name: Set Directories
        id: set-directories # Give it an id to handle to get step outputs in the outputs key above
        run: echo "::set-output name=directories::$(git diff --diff-filter=d --name-only origin/main HEAD | xargs -L1 dirname | uniq | jq -R -s -c 'split("\n")[:-1]|join(",")')"
        # Define step output named dir base on ls command transformed to JSON thanks to jq
  terraform-lint:
    needs: [get-directories] # Depends on previous job
    uses: invitation-homes/github-shared-workflows/.github/workflows/terraform-lint.yml@v1
    secrets: inherit
    with:
      directories: ${{ needs.get-directories.outputs.directories }}
```