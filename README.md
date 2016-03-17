# PlaySPLOM

status: ALPHA

## Install

### Node

You should use `nodejs` >= `4.2.0`

The best way to install `node` is to use `nvm`:

https://github.com/creationix/nvm

This allows you to install different node versions and easily to switch between them.

    nvm install 4.2.1

Switch to it:

    nvm use 4.2.1

Now when you run `node` it is the `4.2.1` version

### PlaySPLOM

Install this app:

    npm install


SuperCollider is included by manually putting a prebuilt version into `app/vendor/supercollider`
Later on this will be installable automatically by npm (node package manager), but for now use the google drive version.


## Run

    npm run start

This will compile and open an Electron app in development mode.


## Auto restarting with nodemon (optional)

This will restart the app anytime you make a change to a source file.

Install nodemon globally so it is on your command line path:

    npm install -g nodemon

and then start the app with:

    nodemon ./tasks/start
