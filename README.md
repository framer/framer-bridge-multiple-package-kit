# Framer Bridge Multiple Package Kit

Framer Bridge is a suite of tools:

- That allows you to automatically publish and distribute components to designers with [Framer](https://framer.com) and the [Framer Store](https://store.framer.com).
- Import in production components built by your engineers. It’s an automatic and continually synced workflow, one that is customizable to your existing development workflow.

This repository links together [folder backed Framer projects](https://www.framer.com/support/using-framer-x/folder-backed-projects/) with the [Framer CLI](https://www.npmjs.com/package/framer-cli) and [GitHub actions](https://github.com/framer/PublishAction)/[CircleCI](https://circleci.com/integrations/github/)/[Travis CI](https://travis-ci.com/) for an easy package publication flow.

## 🏁 Getting started

**Important: This project uses Shared Colors, a feature only available in Framer X26 or higher.**

#### Cloning

1. [Fork this repository](https://help.github.com/en/articles/fork-a-repo).
1. [Clone the forked repository](https://help.github.com/en/articles/cloning-a-repository) locally.
1. Run `yarn` to install dependencies.

Inside the repository directory, you will find two key folders:

- **[`design-system`](/design-system):** contains example production components. Typically, this design system is consumed by multiple projects.
- **[`framer`](/framer):** a directory that contains mutlipe [folder backed projects](https://www.framer.com/support/using-framer-x/folder-backed-projects/) that import the components from [`design-system`](/design-system) and (optionally) adds [interface properties](https://www.framer.com/api/property-controls/) to use in Framer. This is the folder that contains projects that get published to the [Framer store](https://store.framer.com).

#### Editing

From here, you can continue modifying the existing the Framer X files inside of the [`framer` folder](/framer). If you edit any of the components in [`design-system`](/design-system), they will automatically get updated in Framer too.

If you want to import your own design system, you can replace both files with your own. Make sure that your Framer project is [folder backed](https://www.framer.com/support/using-framer-x/folder-backed-projects/).

#### Publishing

1. From the terminal, run:
   ```sh
   npx framer-cli authenticate <your-framer-account-email>
   ```
1. **If the package has not been previously published to the store**, publish the package for the first time by running
   ```sh
   env FRAMER_TOKEN=<token> npx framer-cli publish <package-name.framerfx> --new="<Display Name>"
   ```

## 🚚 Using CI

As an example of integrating `framer-cli` with an external CI service, there is a small [CircleCI configuration](https://circleci.com/docs/2.0/configuration-reference) and [Travis CI configuration](https://docs.travis-ci.com/user/tutorial/#to-get-started-with-travis-ci) included in this repository that publishes updates to the package in the [Framer store](https://store.framer.com) every time a commit is pushed on a branch _other than_ `master`.

The CI configuration is smart enough to only publish/update the packages where updates to the imported components were changed (i.e. if [Button.tsx](/design-system/components/Button.tsx) was updated, only the [Buttons.framerfx](/framer/buttons.framerfx) Package will be updated in the Framer Team Store.)

You can configure the `paths` field in the `package.json` to configure a different setup when files are chagned.

- `componentPath`: The relative path to the file or directory that will trigger the `cmd` script when changes are found.
- `cmd`: The command to run when a change is found in the `componentPath` directory or file.

**To integrate with CircleCI:**

1. [Connect your repository with CircleCI](https://circleci.com/integrations/github/).
1. Add the `FRAMER_TOKEN` environment variable in the [CI project settings](https://circleci.com/docs/2.0/env-vars/#setting-an-environment-variable-in-a-project).
1. Publish a brand new version of your package to the [Framer store](https://store.framer.com) by pushing a commit on a branch _other than_ `master`

**To integrate with Travis CI:**

1. [Connect your repository with Travis CI](https://docs.travis-ci.com/user/tutorial/#to-get-started-with-travis-ci).
1. Add the `FRAMER_TOKEN` environment variable in the [CI project settings](https://docs.travis-ci.com/user/environment-variables).
1. Publish a brand new version of your package to the [Framer store](https://store.framer.com) by pushing a commit on a branch _other than_ `master`
