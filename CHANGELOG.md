# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [v0.8.12] - 2025-01-10

### Fixed

- Fix how week worked time is calculated

## [v0.8.11] - 2024-12-21

### Changed

- Node packages updated
- Rust packages updated

### Fixed

- Fix a bug where the try and app icons weren't show properly

## [v0.8.10] - 2024-09-02

### Added

- Total week work time added in settings

### Changed

- Node and rust packages updated
- MUI grid component replaced by grid2
- Migrate new TextField InputProps to slotProps

## [v0.8.9] - 2024-08-27

### Fixed

- Fix close button of sync modal

## [v0.8.8] - 2024-08-26

### Fixed

- Fix status of close button in the sync modal

## [v0.8.7] - 2024-08-24

### Added

- Add frontend tests with vitest

### Changed

- Code refactored
- Integration configuration changed to json (BREAKING CHANGE!)
- Some packages updated

### Fixed

- External ID field changed to non-required

## [v0.8.6] - 2024-08-13

### Changed

- Previous tasks longer than four days cannot been continued
- Packages updated
- Refactor some React code

### Fixed

- Disable 'send' button while redmine's activites are loading

## [v0.8.5] - 2024-08-11

### Added

- Add the 'project' column into the tasks to sync table
- Enable tauri's updater plugin to detect and install next versions automatically

### Changed

- Rust and node dependencies updated

## [v0.8.4] - 2024-06-25

### Changed

- Packages updated
- Catch network error if it's not available

### Fixed

- Hide "copy to add form" icon when the external id is missing

## [v0.8.3] - 2024-05-29

### Added

- Add more checks establishing the database connection

### Changed

- Update some dependencies

### Fixed

- Bug fixed calculating the weekly and montly worked time

## [v0.8.2] - 2024-05-26

### Changed

- Upgrade some npm packages
- Buttons color improved in the resume last task confirmation dialog

## [v0.8.1] - 2024-05-23

### Fixed

- Fix query to detect the last task

## [v0.8.0] - 2024-05-22

### Added

- Allows you to continue with a task form the previous day

### Changed

- Dependencies upgraded

## [v0.7.0] - 2024-05-16

### Added

- Add a contribute and changelog links into the info settings tab
- Tauri Framework V2

### Changed

- Task table component code improved
- Improve message when there are not tasks to send
- Improve design of the info settings tab
- Set the day to today on click on the header app logo

### Fixed

- Search results didn't show

## [v0.6.2] - 2024-05-15

### Added

- Copy project, desc or ext. id to the clipboard on click over
- Search results are cleaned once a new task is added

## [v0.6.1] - 2024-05-12

### Changed

- Improved settings for the integrations and added a tooltip to show a help


## [v0.6.0] - 2024-05-08

### Added

- Add Jira integration

## [v0.5.1] - 2024-05-08

### Fixed

- Add sticky header in the sync tasks table for long tables
- Improve the responsive for the chronological view

## [v0.5.0] - 2024-05-06

### Added

- Add the project name in the favourites list
- Refresh favourites list on toggle one favourite
- Add a default message if there are not tasks to send
- Allow selecting the secondary colour for the theme

### Fixed

- Fix favourites title

## [v0.4.1] - 2024-05-03

### Fixed

- Fixed high CPU fixed when right sidebar was opened

## [v0.4.0] - 2024-05-02

### Changed

- Favourites moved from to the right sidebar

## [v0.3.9] - 2024-04-25

### Added

- Build amd64 and arch64 images for macos

## [v0.3.8] - 2024-04-24

### Changed

- Improve the sync modal adding asynchronous loading by the activities

## [v0.3.7] - 2024-04-24

### Changed

- Reuse db connection

## [v0.3.6] - 2024-04-22

### Changed

- Improve the performance of searchings

## [v0.3.5] - 2024-04-21

### Added

- Check if external id is valid when the sync modal is opened

### Changed

- Rename some internal methods

## [v0.3.4] - 2024-04-18

### Changed

- Sync component code refactored
- Replace some string types by enums
- Show the version number when a new version is available

## [v0.3.3] - 2024-04-17

### Added

- Improve how redmine activities are loaded. Now, they are loaded by project

### Changed

- Align external id string to the right
- Improved how a new version is detected

## [v0.3.2] - 2024-04-15

### Fixed

- Fix areEquals method

## [v0.3.1] - 2024-04-15

### Changed

- Change the systray icon

### Fixed

- Fixed a bug when trying to compare settings

## [v0.3.0] - 2024-04-14

### Added

- Add info tab to the settings page
- Add button to open the folder that contains the database file
- Add new logo

### Changed

- The setting save button is disabled if the settings are not modified
- The integration token field type has been changed to "password"

### Fixed

- Fix a but where the start date was mark as invalid after edit another task

## [v0.2.9] - 2024-04-11

### Added

- Allow select an activity type for the Redmine tasks

### Changed

- Notification of new version has been moved to the bottom of the page
- Snackbar messages moved to the bottom center of the page

## [v0.2.8] - 2024-04-09

### Changed

- Integration tasks sent code refactored
- The color of the "new version" button has been changed

## [v0.2.7] - 2024-04-08

### Added

- Add favourites tasks feature

### Changed

- Some task actions components refactored

## [v0.2.6] - 2024-04-07

### Added

- First stable version
