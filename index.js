const core = require('@actions/core');
const github = require('@actions/github');

function getOctokitClient() {
  const token = core.getInput("GITHUB_TOKEN", { required: true });
  return github.getOctokit(token);
}

async function getWhoms(client) {
  const whoms = core.getInput("WHOMS", { required: true}).split(',').map((m) => m.trim()).map((m) => {
    if (m.indexOf("@") === 0) {
      console.log(`Should look up ${m}`);
      const members = await octokit.teams.listMembersInOrg({
        org: github.context.repo.owner,
        team_slug: m,
      });
      console.log(`members: ${JSON.stringify(members)}`);
      return m
    }
    return m;
  });

  client.info(`whoms: ${JSON.stringify(whoms)}`);
}

async function main() {
  const client = getOctokitClient();
  getWhoms(client);
}

main();
