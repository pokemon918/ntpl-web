# Debugging State with Bookmarklets

[Watch Introduction Video](https://drive.google.com/open?id=1JBbhZJ2cbK9ks8s5qQi-hny_kUBT16bj)

We have our own tool to help sharing our app state and ask for help to reproduce an issue. This tool allows to export the state of the NTBL app to a JSON file that can be shared with developers. Developers can import that JSON file into their NTBL app state and use it to try and figure out what's the reason the user got stuck.

## Motivation

Traditionally, the Redux Dev Tools allows us to export ther Redux state to a JSON file, share that file with somebody, and that person could reproduce your local state by importing your JSON file onto Redux Dev Tools.

This technically does not work for NTBL for a few reasons:

* We use redux-persist to synchronise Redux state with local storage, allowing the app state to be preserved between page reloads, and redux-persist does not support importing a Redux state (it's a known issue for years and they aren't willing to fix it)
* We need a couple of information that are only on local storage and wouldn't be exported by Redux Dev Tools:
  1. We need the `mem` entry from local storage to be able to use the app on behalf of the user who reported the issue, which generally makes it easier to reproduce the issue
  2. We need to known in which route the user was at the moment of the failure, otherwise, our chances of reproducing the issue is greatly reduced - and navigating manually to that route can also make the issue to recover and prevent us to reproduce it (while it's possible to fix this by connecting React Router to Redux, this practice is not recommended)

And there is another great reasons why using Redux Dev Tools isn't viable for us: we want the process to be as simple as possible for people reporting issues. We don't want our testers or end-users to install Redux Dev Tools and follow along with us to learn how to export the app state.

With a custom tool, testers can easily report issues and we might even want to make an automatic collection of the app state on a few kinds of error reports.

## Usage Instructions

Testers can export the local state from the app, but only on test environments by double clicking on the logo og the build versoin et the left side. This is not available on the production instance.

Developers can export and import the local state on any environment, including production, by using our bookmarklets created for this purpose. Bookmarklets are browser bookmarks with JavaScript code. When a bookmarklet is clicked, instead of going to another page, it will run the provided JavaScript code in the current page.

### 1. Export local state from the app

> Disclaimer: This does not work on the production environment.

Click on the Noteable logo at the top left corner of the page. A modal will be displayed asking if you want to send an error report. Click Yes - immediately, the app will generate a random unique error id and export the local state to Bugsnag - and your default email client will be open with an email message prefilled:

* the recipient email address will be prefilled
* the user id and error id in the subject line will be prefilled
* a default message will be prefilled in the body, and you are expected to supply details and tell what you were doing in the app before the issue happened

If the email message is not sent, the error report will remain saved on Bugsnag.

### 2. Install the bookmarklets

Open the file [localstate.html](localstate.html) in the browser you want to install the bookmarklets.

You will find two links in that page: Export NTBL and Import NTBL.

Make sure that your bookmarks bar is visible. Drag and drop each of these links to your bookmarks bar.

Success, the bookmarkets are installed! They will work on all environments, including production.

### 3. Export local state from the bookmarklet


Make sure you've followed the step 2 above.

On your bookmarks bar, press the Export NTBL bookmark. A window to save a file will be opened. Save this file and share it in your task.

### 4. Import local state into the app with the bookmarklet


Make sure you've followed the step 2 above.

Save the state file that you want to import into your computer.

On your bookmarks bar, press the Import NTBL bookmark. A window to open a file will be opened. Select the state file that you want to import. An alert message will be displayed, informing the URL it will be redirected to. Press OK. The app is now loaded with the imported state!