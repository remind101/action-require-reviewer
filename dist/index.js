"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const lodash_1 = require("lodash");
function getOctokitClient() {
    const token = core.getInput("GITHUB_TOKEN", { required: true });
    return github.getOctokit(token);
}
async function getWhoms(client) {
    const parsedWhoms = await core.getInput("WHOMS", { required: true }).split(',').map((m) => m.trim());
    const whoms = await Promise.all(parsedWhoms.map(async (m) => {
        console.log(`looking up: ${m}`);
        if (m.indexOf("@") === 0) {
            console.log(`Should look up ${m}`);
            const members = await client.teams.listMembersInOrg({
                org: github.context.payload.organization.login,
                team_slug: m.substring(1),
            });
            const githubMembers = members.data.map((m) => m ? m.login : '');
            console.log(`members: ${JSON.stringify(githubMembers)}`);
            return githubMembers;
        }
        return m;
    }));
    return lodash_1.flatten(whoms);
}
async function getReviews(client, whoms) {
    // GITHUB_REF refs/pull/:prNumber/merge
    const reviews = await client.pulls.listReviews({
        owner: github.context.payload.organization.login,
        repo: github.context.repo.repo,
        pull_number: github.context.issue.number,
    });
    const filteredReviews = reviews.data.filter((review) => { var _a, _b; return ((_a = review.user) === null || _a === void 0 ? void 0 : _a.login) ? whoms.indexOf((_b = review.user) === null || _b === void 0 ? void 0 : _b.login) >= 0 : false; }).map((r) => { var _a; return ((_a = r.user) === null || _a === void 0 ? void 0 : _a.login) || ''; });
    return filteredReviews;
}
async function main() {
    const client = getOctokitClient();
    const whoms = await getWhoms(client);
    console.log('whoms:', whoms);
    const reviews = await getReviews(client, whoms);
    console.log('reviews:', reviews);
}
main().then(() => {
    console.log('success');
}).catch((err) => {
    console.error(err);
});
