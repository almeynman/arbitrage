# VS Code
Install Prettier plugin

# Setup
Use node >= 10 or install nvm and run
```
nvm use
```

Install google cloud sdk
```
brew cask install google-cloud-sdk
```

Setup google cloud
```
gcloud config set project arbitrage-238217
```

Run `npm install`. This command will also download dependencies of subprojects.


# Structure
The project is a monorepo where repos sit in packages/ folder

The root project is used for shared scripts and configurations, but every package is self-sustainable

# Workflow
Update version of changed packages
```
npm run update-version
```

to run deploy script in all packages run npm run deploy
```
npm run deploy 
```

to deploy a specific package run
```
npm run deploy -- --scope=arbitrage-lib
```

