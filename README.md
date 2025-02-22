# Mattermost Incident Collaboration

[![Build Status](https://img.shields.io/circleci/project/github/mattermost/mattermost-plugin-incident-collaboration/master.svg)](https://circleci.com/gh/mattermost/mattermost-plugin-incident-collaboration)
[![Code Coverage](https://img.shields.io/codecov/c/github/mattermost/mattermost-plugin-incident-collaboration/master.svg)](https://codecov.io/gh/mattermost/mattermost-plugin-incident-collaboration)
[![Release](https://img.shields.io/github/v/release/mattermost/mattermost-plugin-incident-collaboration)](https://github.com/mattermost/mattermost-plugin-incident-collaboration/releases/latest)

Mattermost Incident Collaboration allows your team to coordinate, manage, and resolve incidents from within Mattermost. For configuration and administration information visit our [documentation](https://docs.mattermost.com/administration/devops-command-center.html).

![Mattermost Incident Collaboration](assets/incident_response.png)

## License

This repository is licensed under the [Mattermost Source Available License](LICENSE). See [frequently asked questions](https://docs.mattermost.com/overview/faq.html#mattermost-source-available-license) to learn more.

Although a valid Mattermost Enterprise license is required to access all features if using this plugin in production, the [Mattermost Source Available License](LICENSE) allows you to compile and test this plugin in development and testing environments without a Mattermost Enterprise license. As such, we welcome community contributions to this plugin.

If you're running Mattermost Starter and don't already have a valid license, you can obtain a trial license from **System Console > Edition and License**. If you're running the Team Edition of Mattermost, including when you run the server directly from source, you may instead configure your server to enable both testing (`ServiceSettings.EnableTesting`) and developer mode (`ServiceSettings.EnableDeveloper`). These settings are not recommended in production environments. See [Contributing](#contributing) to learn more about how to set up your development environment.

## Updating documentation

When you've submitted a PR that requires a documentation update, please visit the documentation [here](https://docs.mattermost.com/administration/devops-command-center.html), select **Edit** in the top-right corner of the page, and add your update. You can read more about the process in the [docs repo README file](https://github.com/mattermost/docs).

If you're uncertain whether your PR requires documentation, or you'd like some editorial feedback prior to submitting the docs PR, you can add the `Docs/Needed` label to your PR in this repo, and tag @justinegeffen.

## Generating test data

To quickly test Mattermost Incident Collaboration, use the following test commands to create incidents populated with random data:

- `/incident test create-incident [playbook ID] [timestamp] [incident name]` - Provide the ID of an existing playbook to which the current user has access, a timestamp, and an incident name. The command creates an ongoing incident with the creation date set to the specified timestamp.

  * An example command looks like: `/incident test create-incident 6utgh6qg7p8ndeef9edc583cpc 2020-11-23 PR-Testing`

- `/incident test bulk-data [ongoing] [ended] [days] [seed]` - Provide a number of ongoing and ended incidents, a number of days, and an optional random seed. The command creates the given number of ongoing and ended incidents, with creation dates randomly between n days ago and the day when the command was issued. The seed may be used to reproduce the same outcome on multiple invocations. Incident names are generated randomly.

  * An example command looks like: `/incident test bulk-data 10 3 342 2`

## Contributing

This plugin contains both a server and web app portion. Read our documentation about the [Developer Workflow](https://developers.mattermost.com/extend/plugins/developer-workflow/) and [Developer Setup](https://developers.mattermost.com/extend/plugins/developer-setup/) for more information about developing and extending plugins.

For more information about contributing to Mattermost, and the different ways you can contribute, see https://www.mattermost.org/contribute-to-mattermost.
