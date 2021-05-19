# Setup

**MAKE SURE DOCKER DESKTOP IS RUNNING**

1. `npm i -g lerna`
2. `npm i`
3. `npm run setup`
4. `npm start`

_(Ctrl + C will interrupt webpack-dev-server)_

# Teardown

**MAKE SURE YOU CLOSE DOCKER DESKTOP WHEN YOU'RE DONE**

1. `npm run docker-prune`
2. `lerna clean --yes`

_(`lerna clean --yes` is optional; it just removes node\_modules folders)_
