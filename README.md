# Github Shared Workflows
Repository for GitHub actions and workflows that are intended to be shared across the Invitation Homes organization.

## Workflows

### deploy-heroku-application.yml
Deploys the application to the specified environment in Heroku.  

_Note: this workflow assumes that the Heroku application name 
follows our standard of `invh-<application_name>-<environment>`. Applications that do not follow that standard must 
specify the heroku application names in the deployment section of their
[.repo-metadata.yaml](https://github.com/invitation-homes/technology-decisions/blob/main/resources/.repo-metadata.yaml) file_

#### Example Usage
```yaml
name: Deploy Application

on:
  workflow_dispatch:
    inputs:
      environment:
        description: The target deployment environment
        required: true
        type: choice
        options:
          - "dev"
          - "qa"
          - "uat"
          - "prod"

jobs:
  call_shared_workflow:
    uses: invitation-homes/github-shared-workflows/.github/workflows/deploy-heroku-application.yml@v1
    secrets: inherit
    with:
      environment: ${{ github.event.inputs.environment }}
```

### auto-deploy-heroku-application.yml
Automatically deploys the application to dev and optionally qa.  

* Deployments to **dev** are _enabled by default_, but can be disabled by adding a 
secret named `AUTO_DEPLOY_TO_DEV` with a value of false. 
* Deployments to **qa** are _disabled by default_, but can be enabled by adding a 
secret named `AUTO_DEPLOY_TO_QA` with a value of true.

_Note: this workflow assumes that the Heroku application name
follows our standard of `invh-<application_name>-<environment>`. Applications that do not follow that standard must
specify the heroku application names in the deployment section of their
[.repo-metadata.yaml](https://github.com/invitation-homes/technology-decisions/blob/main/resources/.repo-metadata.yaml) file_

#### Example Usage
```yaml
name: Auto Deploy Application

on:
  push:
    branches:
      - "main"

jobs:
  call_shared_workflow:
    uses: invitation-homes/github-shared-workflows/.github/workflows/auto-deploy-heroku-application.yml@v1
    secrets: inherit
```