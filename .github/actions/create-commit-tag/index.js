const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');

const run = async () => {
  const packageJson = fs.readFileSync('./package.json', 'utf-8');
  const parsed = JSON.parse(packageJson);
  const shortSha = github.context.sha.substr(0, 7);
  const tagName = `${parsed.version}-${github.context.runNumber}-${shortSha}`;
  const githubToken = core.getInput('github-token');
  const octokit = github.getOctokit(githubToken);

  const existingReference = await octokit.rest.git.getRef({
    ...github.context.repo,
    ref: `tags/${tagName}`
  }).catch(() => core.info(`Tag ${tagName} does not exist`));

  if (existingReference) {
    core.info(`Tag ${tagName} already exists`);

  } else {
    core.info(`Creating tag: ${tagName}, commit: ${github.context.sha}`);
    const annotatedTag = await octokit.rest.git.createTag({
      ...github.context.repo,
      tag: tagName,
      message: tagName,
      object: github.context.sha,
      type: 'commit',
    });

    await octokit.rest.git.createRef({
      ...github.context.repo,
      ref: `refs/tags/${tagName}`,
      sha: annotatedTag.data.sha
    });
  }

  core.setOutput('tag_name', tagName);
}

run().catch(error => core.setFailed(error.message));
