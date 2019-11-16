# Setup

## Yarn
Install yarn with homebrew
```
brew install yarn
```

Install all dependencies in a project
```
yarn
```

## VS Code
Recommended VS Code plugins:
- Prettier
- 

## NVM

Use node >= 10 or install nvm and run

```
nvm use
```

Install following plugins for VsCode:

- Prettier
- TSLint
- EditorConfig
- vsc-nvm


# Workflow
There are 2 types of packages: libraries and apps (services). 
An app can depend on one or more library, but not on another app.
A library can depend on another library, but not on an app.

Project uses yarn workspaces. It allows for the following workflow:
Each folder is an isolated npm package with its own dependencies
Each package must implement the following commands:
lint
build
watch
test
clean

if package is an app it must also include 
start
stop
deploy
destroy

# Project management
## To run a command in all packages
```
yarn wsrun <command-name> // runs yarn <command-name> in each package
```
or
```
yarn workspace <package-name> <script-name>
```

## To run some script defined in package.json of a particular package run
```
yarn wsrun -p <package-name> -c <script-name>
```
or
```
yarn workspace <package-name> <script-name>
```

## To run some script defined in package.json of a particular package and all of its dependencies run
```
yarn wsrun -p <package-name> -r <script-name>
```
```
yarn wsrun -p assessor-app -r watch // watches any changes in workspace and its dependencies and rebuilds
```

## To add a dependency to a particular package run
```
yarn workspace <package-name> add <dependency-name> // add --dev if dev dependency
```

## To remove a dependency from a particular package run
```
yarn workspace <package-name> remove <dependency-name>
```

## You can also get a dependency graph with
```
yarn workspaces info
```

More info on (yarn workspace)[https://yarnpkg.com/lang/en/docs/cli/workspace/]
More info on (yarn workspaces)[https://yarnpkg.com/en/docs/cli/workspaces]
More info on (wsrun)[https://github.com/hfour/wsrun]
