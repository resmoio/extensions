# Hypersonic Changelog

## [2.0.0] - 2022-12-01

#### New

- You can now create todos with natural language. Including tags, projects, assignees.
- Support for multiple database relationships.
- Database settings view to improve set up.
- Combine filters by projects, tags and assignees.
- Added instant refresh to menu bar command.
- Copy Task URL action.
- Mark as not started action.
- Add Project to a task action.
- Assign user to a task action.

#### Updated

- Modify task date using natural language.
- Replaced 'Remind me' action for 'Due Date'.
- Menu bar command to work with filters.
- Menu bar command background fetch time from 1 to 5 minutes.
- Share your work action to work with filters.
- Conditional Open detail action if Notion is installed.
- Conditional Open Notion database action if Notion is installed.
- Hypersonic icon.

#### Deprecated

- Move command

## [0.0.3] - 2022-09-15

- Update Raycast to "@raycast/api": "1.39.2"
- Update Raycast to "@raycast/utils": "1.4.0"
- Update Notion to "@notionhq/client": "2.2.0"
- Major refactor of the code using the new useCachedPromise hook.
- Added support for custom properties database names.
- Added support to complete tasks using the new status property from notion.
- Added support for In progress status when using the new status property.
- Better integration with notion fetching todos created directly from there without date and name.
- Change authorize command to `cmd + shift + A`.
- New menu bar command to interact with your todos and background fetching

## [0.0.2] - 2022-07-15

- Added custom reminder. Now You can set custom reminder for each task.
- Added filter by label.
- Added `undo` command for undoing last mark as completed todo action.
- Changed todo's sorting order.
- Remapping the columns. Now you can change the columns names in order to implement `Hypersonic` with your databases. You can change the columns names with the `cmd + ,`.

## [0.0.1] - 2022-07-01

- Changed the `openExtensionPreferences` to `openCommandPreferences` action, in order to get the extension selection on list.

## [Initial Version] - 2022-06-10
