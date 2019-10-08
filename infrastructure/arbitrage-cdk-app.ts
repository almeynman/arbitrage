#!/usr/bin/env node

import * as cdk from '@aws-cdk/core'

import { AppStack } from './app-stack'
import { ContinuousIntegrationStack } from './ci-stack'
import { AppImage } from './app-image'

const app = new cdk.App()

const image = new AppImage(app, 'arbitrage-image')

const appStack = new AppStack(app, 'arbitrage-app', { repository: image.repository })

new ContinuousIntegrationStack(app, 'arbitrage-ci', {
    image: image.image,
    repository: image.repository,
    service: appStack.service
})

app.synth()
