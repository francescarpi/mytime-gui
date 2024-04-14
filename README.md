# mytime

![Logo](./app-icon.png | width=200)

MyTime is an application to track your working time. It allows you register your daily tasks, calculate its duration
and synchronize with your ticketing system. At them moment is only integrated with Redmine.

Create tasks:
![Screenshot 1](./captures/cap1.png)

See running and tasks done:
![Screenshot 2](./captures/cap2.jpeg)

Synchronize your tasks:
![Screenshot 3](./captures/cap3.jpeg)

## Database

It uses *sqlite3* to manage the database. It's stored at:

* Linux & Mac: `$HOME/.local/share/mytime/mytime.db`
* Windows: `C:\Users\%USERNAME%\AppData\Local\mytime\mytime.db`

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
