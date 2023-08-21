/* eslint-disable @typescript-eslint/no-var-requires */
const { version } = require("./package.json");
const { spawnSync } = require("child_process");

const commander = (command, args, showOutput = true) => {
  const { output, status } = spawnSync(command, args, {encoding: "utf8"});
  if (status !== 0) {
    console.log({ command, args, showOutput });
    throw new Error(output)
  }

  if (showOutput) {
    console.log(output.filter(Boolean).join(''))
  }
} 

const git = (command, args) => commander('git', [command, ...args])

git('config', ['user.name', 'github-actions'])
git('config', ['user.email','github-actions@github.com'])
git('add', ['CHANGELOG.md', 'package.json'])
git('commit', ['-m', `'Release version ${version} [skip ci]'`,'--no-verify'])
git('tag', ['-a', `v${version}`, '-m', `'Release version ${version}'`])
git('push', ['origin', 'main', '--dry-run', '--no-verify'])
git('push', ['origin', `v${version}`, '--dry-run', '--no-verify'])
