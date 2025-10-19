const core = require('@actions/core');
const github = require('@actions/github');

function matchesPattern(filePath, pattern) {
  const regexPattern = pattern
    .replace(/\*\*/g, '.*')
    .replace(/\*/g, '[^/]*')
    .replace(/\?/g, '.');
  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(filePath);
}

async function run() {
  try {
    const token = core.getInput('github_token', { required: true });
    const pathLabelsInput = core.getInput('path_labels', { required: true });
    const pathLabels = JSON.parse(pathLabelsInput);
    
    const context = github.context;
    if (!context.payload.pull_request) {
      core.info('Not a PR event, skipping');
      return;
    }
    
    const { owner, repo } = context.repo;
    const prNumber = context.payload.pull_request.number;
    const octokit = github.getOctokit(token);
    
    const { data: files } = await octokit.rest.pulls.listFiles({
      owner,
      repo,
      pull_number: prNumber
    });
    
    const labelsToAdd = new Set();
    
    for (const file of files) {
      for (const [pattern, label] of Object.entries(pathLabels)) {
        if (matchesPattern(file.filename, pattern)) {
          labelsToAdd.add(label);
        }
      }
    }
    
    if (labelsToAdd.size > 0) {
      await octokit.rest.issues.addLabels({
        owner,
        repo,
        issue_number: prNumber,
        labels: Array.from(labelsToAdd)
      });
      
      core.info(`✅ Added labels: ${Array.from(labelsToAdd).join(', ')}`);
      core.setOutput('labels_added', Array.from(labelsToAdd).join(','));
    } else {
      core.info('No matching labels found');
      core.setOutput('labels_added', '');
    }
    
  } catch (error) {
    core.setFailed(`Action failed: ${error.message}`);
  }
}

run();

