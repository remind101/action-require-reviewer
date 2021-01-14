const core = require('@actions/core');
const github = require('@actions/github');

function getOctokitClient() {
  const token = core.getInput("GITHUB_TOKEN", { required: true });
  return github.getOctokit(token);
}

async function getWhoms(client) {
  const whoms = await core.getInput("WHOMS", { required: true}).split(',').map((m) => m.trim()).map(async (m) => {
    if (m.indexOf("@") === 0) {
      console.log(`Should look up ${m}`);
      const members = await client.teams.listMembersInOrg({
        org: github.context.payload.organization.login,
        team_slug: m.substring(1),
      });
      console.log(`members: ${JSON.stringify(members)}`);
      return m;
    }
    return m;
  });

  console.log(`whoms: ${JSON.stringify(whoms)}`);
}

async function main() {
  const client = getOctokitClient();
  getWhoms(client);
}

main().then(() => {
  console.log('success');
}).catch((err) => {
  console.error(err);
});
