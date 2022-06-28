const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const yaml = require('yaml');

const REPOSITORY_METADATA_FILE = './.repo-metadata.yaml';

/**
 * Returns the Heroku Application Name for the given environment
 *
 * This function will check the repository metadata file to see if a name override
 * has been configured for the specified environment.
 *
 * If so, it will return that value.  Otherwise, return the standard heroku application
 * name "invh-<application_name>-<environment>"
 */
const getHerokuApplicationName = (environment) => {
  const applicationName = github.context.payload.repository.name;
  const defaultHerokuApplicationName = `invh-${applicationName}-${environment}`;
  core.info(`Application Name: ${applicationName}`);
  core.info(`Default Heroku Application Name: ${defaultHerokuApplicationName}`);

  if (fs.existsSync(REPOSITORY_METADATA_FILE)) {
    const metadata = fs.readFileSync(REPOSITORY_METADATA_FILE, 'utf-8');
    const parsed = yaml.parse(metadata);
    const herokuApplicationNameOverride =
      parsed &&
      parsed['deployment'] &&
      parsed['deployment']['heroku-application-name'] &&
      parsed['deployment']['heroku-application-name'][environment];
    core.info(`Heroku Application Name Override: ${herokuApplicationNameOverride}`);

    if (herokuApplicationNameOverride) {
      return herokuApplicationNameOverride;
    }
  } else {
    core.warning(`${REPOSITORY_METADATA_FILE} file missing for repository`);
  }

  return defaultHerokuApplicationName;
};

try {
  const environment = core.getInput('environment');
  const herokuApplicationName = getHerokuApplicationName(environment);
  core.info(`Environment: ${environment}`);
  core.info(`Heroku Application Name: ${herokuApplicationName}`);

  core.setOutput('heroku-application-name', herokuApplicationName);
} catch (error) {
  core.setFailed(error.message);
}

exports.getHerokuApplicationName = getHerokuApplicationName;
