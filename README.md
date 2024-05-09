# mytime

<p align="center">
  <img src="./app-icon.png" width="200">
</p>

MyTime is an application to track your working time. It allows you register your daily tasks, calculate its duration
and synchronize with your ticketing system. At them moment is only integrated with Redmine and Jira.

Initial screen:
![Screenshot 1](./captures/cap1.jpeg)

App with running tasks:
![Screenshot 2](./captures/cap2.png)

Synchronize your tasks:
![Screenshot 3](./captures/cap3.png)

## Database

It uses *sqlite3* to manage the database. It's stored at:

* Linux & Mac: `$HOME/.local/share/mytime/mytime.sqlite`
* Windows: `C:\Users\%USERNAME%\AppData\Local\mytime\mytime.sqlite`

## Development

Checkout repository. Main branch is called "main".

Run dev environment:

```
cd mytime-gui
npm install
npm run tauri dev
```

Build:

```
npm run tauri build
```

## Integrations, get tokens

### Redmine

* Go to your account ("https://<your-domain>/my/account")
* The API access key is in the right sidebar


### Jira

* Go to the tokens generator [page](https://id.atlassian.com/manage-profile/security/api-tokens)
* Use them in the config.
* The username is your email
