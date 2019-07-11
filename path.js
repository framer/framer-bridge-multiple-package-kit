const { execSync } = require("child_process");
const fs = require("fs");

const EXAMPLE = `
    Example package.json:

    {
      "name": "example-package",
      "version": "1.1.0"
      "paths": [
        {
          "componentPath": "path/to/component/Component.tsx",
          "cmd": "npx framer-cli publish ./component.framerfx --yes"
        }
      ]
    }

    Where "cmd" is the command that will run if the regular expression under
    "componentPath" matches any added, removed or modified file.
`;

const throwMissingChangesField = () =>
  new Error(`Expected your package.json to have a non-empty array at the "paths" key:

${EXAMPLE}
`);

const throwMissingcomponentPathField = () =>
  new Error(`Expected your package.json's items to have a "componentPath" field:

${EXAMPLE}
`);

const throwMissingCmdField = () =>
  new Error(`Expected your package.json's items to have a "cmd" field:

${EXAMPLE}
`);

const paths = execSync("git diff origin/master --name-status")
  .toString()
  .split("\n")
  .map(line => line.match(/(\S+)\s+(\S+$)/))
  .filter(l => !!l)
  .map(parsed => {
    return {
      type: parsed[1],
      file: parsed[2]
    };
  });

const packageJson = JSON.parse(fs.readFileSync("package.json"));

if (!packageJson["paths"] || packageJson["paths"].length === 0) {
  throw throwMissingChangesField();
}

(packageJson["paths"] || []).forEach(changeSpec => {
  const componentPath = changeSpec && changeSpec["componentPath"];
  const cmd = changeSpec && changeSpec["cmd"];

  if (!componentPath || typeof componentPath !== "string") {
    throw throwMissingcomponentPathField();
  }

  if (!cmd || typeof cmd !== "string") {
    throw throwMissingCmdField();
  }

  const compiledRegex = new RegExp(componentPath);
  const changeDetected = paths.some(change => {
    return compiledRegex.test(change.file);
  });

  if (changeDetected) {
    console.log("Change detected, running command:", cmd);
    console.log(execSync(cmd).toString());
  }
});
