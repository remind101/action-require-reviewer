const core = require('@actions/core');
const github = require('@actions/github');

function getOctokitClient() {
  const token = core.getInput("GITHUB_TOKEN", { required: true });
  return github.getOctokit(token);
}

async function getWhoms(client) {
  const whoms = core.getInput("WHOMS", { required: true}).split(',').map((m) => m.trim()).map((m) => {
    if (m.indexOf("@") === 0) {
      client.info(`Should look up ${m}`);
      // octokit.teams.listMembersInOrg({
      //   org,
      //   team_slug,
      // });
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
