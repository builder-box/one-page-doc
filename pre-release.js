/* eslint-disable @typescript-eslint/no-var-requires */
const pack = require("./package.json");
const { writeFileSync, readFileSync } = require("fs")

const SemVer = {
  NO_RELEASE: 'no-release',
  MAJOR: 'major',
  MINOR: 'minor',
  PATCH: "patch",
}

const PreRel= {
  NO_PRE_RELEASE: "no-pre-release",
  ALPHA: 'alpha',
  BETA: 'beta',
  RC: 'rc',
}

const getVersionInfo = (value) => {
  const [fullVersion, meta] = value.split("+")
  const [version, fullPreRelease = ''] = fullVersion.split("-")
  const [preRelease, preReleaseNum = 0] = fullPreRelease.split(".").map((val) => !isNaN(val) ? parseInt(val, 10) : val)
  const [major, minor, patch] = version.split(".").map((val) => parseInt(val, 10));
  return {
    major,
    minor,
    patch,
    preRelease,
    preReleaseNum,
    meta,
  }
}

const getReleaseVersion = (release, major, minor, patch) => {
  switch (release) {
    case SemVer.MAJOR: return `${major + 1}.0.0`
    case SemVer.MINOR: return `${major}.${minor + 1}.0`
    case SemVer.PATCH: return `${major}.${minor}.${patch + 1}`
    case SemVer.NO_RELEASE: return `${major}.${minor}.${patch}`
  }
}
const getPreReleaseVersion = (preRel, oldPreRel, preRelNum) => {
  return `${preRel}${(preRel === oldPreRel ? '.'+(preRelNum+1) : '')}`
}

const [,, release, preRel, metadata, changes = '[]'] = process.argv

if (!release) {
  throw new Error("Unable to publish a version, a Semantic Version is Required")
}
if (!preRel) {
  throw new Error("Unable to publish a version, a Pre Release Version is Required")
}
if (metadata ===  undefined) {
  throw new Error("Unable to publish a version, a Release Metadata is Required")
}
if (release === SemVer.NO_RELEASE && preRel === PreRel.NO_PRE_RELEASE && metadata.trim() === '') {
  throw new Error("Unable to publish a version, at least one of these parameters is required: Semantic Version, Pre Release Version or Release Metadata")
}

const isPreRel = preRel && preRel !== PreRel.NO_PRE_RELEASE;
const hasMeta = metadata?.length > 0;
const { major, minor, patch, preRelease, preReleaseNum } = getVersionInfo(pack.version);

let version = getReleaseVersion(release, major, minor, patch)

if (isPreRel) {
  version = `${version}-${getPreReleaseVersion(preRel, preRelease, preReleaseNum)}` 
}

if (hasMeta) {
  version = `${version}+${metadata}`
}

pack.version = version;

writeFileSync('./package.json', JSON.stringify(pack, null, 2), "utf8");

const finalChanges = JSON.parse(changes).map((val) => `  - ${val}`);

if (finalChanges.length > 0) {
  console.log({ finalChanges })
  const changelog = readFileSync('./CHANGELOG.md', { encoding: "utf8" }).toString().split("\n");
  const inx = changelog.findIndex((val) => /\d+.\d+.\d+(-[a-z0-9A-Z.]+)*(\+[a-z0-9A-Z.]+)*/.test(val));
  const finalChangeLog = changelog.slice(0, inx)
  .concat(
    [`- ${version}`].concat(finalChanges),
    changelog.slice(inx)
    )
  writeFileSync('./CHANGELOG.md', finalChangeLog.join('\n'), "utf8")
}
