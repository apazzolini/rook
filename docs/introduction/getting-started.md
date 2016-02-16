## Getting Started

### Dependencies

You'll need just a few things to get started:

- [Node](https://nodejs.org/en/) (at least version 4.0)
- NPM (at least version 3.3, comes bundled with Node)

### Starting with the rook-starter sample project

[rook-starter](https://github.com/apazzolini/rook-starter) is the easiest way to get up and running with Rook. It is a barebones application shell that has simple examples of typical web app tasks. It's also set up with the scripts you'll need for development and deploying.

1. `git clone git@github.com:apazzolini/rook-starter.git`
2. `cd rook-starter`
3. `npm install`

### Running the development server

After NPM has finished working it's magic, you'll be able to launch your first Rook app by executing `npm run dev`.

This command starts up the core Hapi server on port 3000 as well as a Webpack dev server on port 3001. The former serves your application, and the latter provides hot-reload support.

You're now able to visit http://localhost:3000 and see your app. Keep this task running in the background for hot-reloading. The Hapi server does not run through Webpack, and thus will not hot-reload. Instead, it's launched through nodemon and will restart itself on file changes.

> Note: There are a few rare occasions where Webpack is not able to hot-reload a module for you. These instances are logged to your browser's console. Refresh the page when you see such as a message to ensure the latest code is running.

### Linting your code

Linting is important. It enforces consistent coding style catches errors before runtime. Rook strongly believes in a good linting setup and comes configured with [eslint](http://eslint.org/). `npm run lint` will check your code, but it's also a good idea to directly integrate your editor. For example, you may choose to use [syntastic](https://github.com/scrooloose/syntastic) and [eslint_d.js](https://github.com/mantoni/eslint_d.js) in a VIM environment.

### Testing your code

Testing is also important. Hapi, Redux, and React all provide helpers for making testing painless. `npm run test` will take care of running all three types of tests for you.

### Building and deploying your app

Once you're ready to show your application to the world, you'll need to build the production bundle. This is pretty easy - `npm run build`. Once you have your bundle ready, `npm run start` launches the Hapi server in production mode.

## Next Steps

You've got your project set up and understand the scripts provided by Rook. It's time to [understand the project structure](project-structure.md)!