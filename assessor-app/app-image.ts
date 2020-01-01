import * as cdk from "@aws-cdk/core"
import * as ecrAssets from "@aws-cdk/aws-ecr-assets"
import * as ecr from "@aws-cdk/aws-ecr"

export interface AppImageArgs {
  app: cdk.App;
  id: string;
  repositoryName: string;
}

export class AppImage extends cdk.Stack {
  public readonly repository: ecr.IRepository;
  public readonly image: ecrAssets.DockerImageAsset;

  constructor({ app, id, repositoryName }: AppImageArgs) {
    super(app, id)
    this.image = new ecrAssets.DockerImageAsset(this, "image", {
      directory: "./",
      repositoryName,
      exclude: ["!(Dockerfile|assessor-app.zip)"]
    })
    this.repository = this.image.repository
  }
}
