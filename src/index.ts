import * as core from '@actions/core';
import * as github from '@actions/github';
import { context, GitHub } from '@actions/github/lib/utils';
import { flatten, intersection } from 'lodash';

/**
 * Get the github client with auth
 */
function getOctokitClient(): InstanceType<typeof GitHub> {
  const token = core.getInput("GITHUB_TOKEN", { required: true });
  return github.getOctokit(token);
}

/**
 * Process the `whoms` to a complete list of github users
 * @param client github client
 */
async function getWhoms(client:InstanceType<typeof GitHub> ): Promise<string[]> {
  const parsedWhoms = await core.getInput("WHOMS", { required: true}).split(',').map((m) => m.trim());
  const whoms = await Promise.all(parsedWhoms.map(async (m) => {
    if (m.indexOf("@") === 0) {
      const members = await client.teams.listMembersInOrg({
        org: github.context.payload.organization.login,
        team_slug: m.substring(1),
      });
      const githubMembers = members.data.map((m) => m ? m.login: '');
      return githubMembers;
    }
    return m;
  }));
  return flatten(whoms);
}

/**
 *
 * @param client github client
 * @param whoms 
 */
async function getReviews(client:InstanceType<typeof GitHub>, whoms: string[]): Promise<string[]> {
  // GITHUB_REF refs/pull/:prNumber/merge
  const reviews = await client.pulls.listReviews({
    owner: github.context.payload.organization.login,
    repo: github.context.repo.repo,
    pull_number: github.context.issue.number,
  });

  const filteredReviews = reviews.data.filter((review) => review.user?.login ? whoms.indexOf(review.user?.login) >= 0 : false).map((r) => r.user?.login || '');
  return filteredReviews;
}

async function main() {
  const client = getOctokitClient();
  const whoms = await getWhoms(client);
  console.log('who is expected to review:', whoms);
  const reviewers = await getReviews(client, whoms);
  console.log('folks who have reviewed:', reviewers);
  const acceptedReviewers = intersection(whoms, reviewers)
  console.log('matching accepted reviewers:', acceptedReviewers);
  if (acceptedReviewers.length === 0) {
    process.exit(1);
  }
}

main().then(() => {
  console.log('success');
}).catch((err) => {
  console.error(err);

});
