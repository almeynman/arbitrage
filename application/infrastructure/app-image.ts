import cdk = require('@aws-cdk/core')
import ecr_assets = require('@aws-cdk/aws-ecr-assets')
import ecr = require('@aws-cdk/aws-ecr')

export class AppImage extends cdk.Stack {
    public readonly repository: ecr.Repository
    public readonly image: ecr_assets.DockerImageAsset

    constructor(app: cdk.App, id: string) {
        super(app, id)

        this.repository = new ecr.Repository(this, 'builds')

        this.image = new ecr_assets.DockerImageAsset(this, 'image', {
            directory: '../src',
            repositoryName: 'arbitrage'
        })
    }
}