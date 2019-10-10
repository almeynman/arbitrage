import * as cdk from '@aws-cdk/core'
import * as ecr_assets from '@aws-cdk/aws-ecr-assets'
import * as ecr from '@aws-cdk/aws-ecr'

export class AppImage extends cdk.Stack {
    public readonly repository: ecr.IRepository
    public readonly image: ecr_assets.DockerImageAsset

    constructor(app: cdk.App, id: string) {
        super(app, id)
        this.image = new ecr_assets.DockerImageAsset(this, 'image', {
            directory: '../application',
            repositoryName: 'arbitrage'
        })
      this.repository = this.image.repository;
  }
}