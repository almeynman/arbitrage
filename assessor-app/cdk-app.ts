#!/usr/bin/env node

import * as cdk from '@aws-cdk/core'

import { AppImage } from './app-image'
import { AppStack } from './app-stack'
// import { ContinuousIntegrationStack } from './ci-stack'

const app = new cdk.App()

const appName = 'assessor-app'

const image = new AppImage({
  app,
  id: 'assessor-app-image',
  repositoryName:  appName
})

// const appStack =
new AppStack({
  app,
  id: 'assessor-app-stack',
  props: {},
  repository: image.repository,
  appName
})

// new ContinuousIntegrationStack(app, 'assessor-app-ci', {
//     image: image.image,
//     repository: image.repository,
//     service: appStack.service
// })

app.synth()
