# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Please check our [developers guide](https://gitlab.com/tokend/developers-guide)
for further information about branching and tagging conventions.

## [Unreleased]
#### Changed
- Slack permissions are now read-only
- `Date` column replaced with `Updated at` on the unverified page

## [0.5.1] - 2023-10-11
#### Removed
- "v" of tag in regexp for GitLab CI

## [0.5.0] - 2023-10-10
#### Added
- Modules trees for unverified users
- `UnverifiedUserModuleItem` component

#### Fixed
- `ModuleTreesItem` component

## [0.4.0] - 2023-10-10
#### Added
- Telegram chats dropdown
- Checking is user already exist in submodule

#### Fixed
- Deleting for verified user
- `StatusModal` current page number
- Status modal request statuses

## [0.3.0] - 2023-05-04
#### Added
- Disabled permissions editing for Telegram tree
- Refresh modal
- `AppTooltip` component
- Multiple verify modules for user
- Sorting and filtering for unverified users
- Clear button to inputs
- Group for unverified users
- Search by module
- Request statuses modal
- Pagination for modules tree
- GitHub module
- Git tree for git modules

#### Changed
- Trash icons
- User details page

#### Fixed
- Refresh modules flow
- `StatusModal` height
- Text in `PermissionModal`
- Refresh estimate
- Search by input in submodules
- `SelectField` logic
- Design for unverified page
- Refresh tokens flow
- `VerifyUserModal` working flow
- Spacing in status modal
- Add module popup
- User details page
- Name on details page
- Request modal fields
- Validation for user creating

## [0.2.0] - 2023-02-14
#### Changed
- Login Page design

#### Fixed
- Release check with wrong link

## [0.1.0] - 2023-02-06
#### Added
- Authorization
- Users list
- Modal
- Repositories tree

#### Fixed
- User details requests queue

#### Under the hood changes
- Initiated and setup project

[Unreleased]: https://github.com/acs-dl/admin-panel/compare/0.5.1...main
[0.5.1]: https://github.com/acs-dl/admin-panel/compare/0.5.0...0.5.1
[0.5.0]: https://github.com/acs-dl/admin-panel/compare/0.4.0...0.5.0
[0.4.0]: https://github.com/acs-dl/admin-panel/compare/0.3.0...0.4.0
[0.3.0]: https://github.com/acs-dl/admin-panel/compare/0.2.0...0.3.0
[0.2.0]: https://github.com/acs-dl/admin-panel/compare/0.1.0...0.2.0
[0.1.0]: https://github.com/acs-dl/admin-panel/tree/0.1.0
