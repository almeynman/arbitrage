import * as cdk from '@aws-cdk/core'
import * as ecr from '@aws-cdk/aws-ecr'
import * as codepipeline from '@aws-cdk/aws-codepipeline'
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions'
import * as codebuild from '@aws-cdk/aws-codebuild'
import * as ecr_assets from '@aws-cdk/aws-ecr-assets'
import * as ecs from '@aws-cdk/aws-ecs'
import * as iam from '@aws-cdk/aws-iam'
import * as adb from '@mobileposse/auto-delete-bucket'

export interface ContinuousIntegrationProps extends cdk.StackProps {
    repository: ecr.IRepository,
    image: ecr_assets.DockerImageAsset,
    service: ecs.BaseService
}

export class ContinuousIntegrationStack extends cdk.Stack {
    constructor(app: cdk.App, id: string, props: ContinuousIntegrationProps) {
        super(app, id, props)

        const sourceOutput = new codepipeline.Artifact('SourceOutput')
        const oauthSecret = cdk.SecretValue.secretsManager('my-github-token')

        const sourceAction = new codepipeline_actions.GitHubSourceAction({
            actionName: 'GitHub_Source',
            owner: 'almeynman',
            repo: 'arbitrage',
            trigger: codepipeline_actions.GitHubTrigger.WEBHOOK,
            oauthToken: oauthSecret,
            output: sourceOutput
        })

        const project = new codebuild.PipelineProject(this, `arbitrage-project`, {
            environment: {
                buildImage: codebuild.LinuxBuildImage.UBUNTU_14_04_NODEJS_10_14_1,
                privileged: true,
                environmentVariables: {
                    REPOSITORY_URI: {
                        value: props.repository.repositoryUri
                    }
                }
            },
            buildSpec: codebuild.BuildSpec.fromObject({
                version: '0.2',
                phases: {
                    pre_build: {
                        commands: [
                            'echo Logging into AWS ECR ...',
                            '$(aws ecr get-login --no-include-email --region $AWS_DEFAULT_REGION)',
                            'SHA=${CODEBUILD_RESOLVED_SOURCE_VERSION}'
                        ]
                    },
                    build: {
                        commands: [
                            'echo Building docker image ...',
                            'docker build docs/. -t $REPOSITORY_URI:latest',
                            'docker tag $REPOSITORY_URI:latest $REPOSITORY_URI:$SHA'
                        ]
                    },
                    post_build: {
                        commands: [
                            'echo Pushing docker image to ECR ...',
                            'docker push $REPOSITORY_URI:$SHA',
                            'docker push $REPOSITORY_URI:latest',
                            'printf \'[{"name":"web","imageUri":"%s"}]\' $REPOSITORY_URI:latest > imagedefinitions.json'
                        ]
                    }
                },
                artifacts: {
                    files: 'imagedefinitions.json'
                }
            })
        })

        props.image.repository.grantPullPush(project)

        const buildOutput = new codepipeline.Artifact('BuildOutput')
        const buildAction = new codepipeline_actions.CodeBuildAction({
            actionName: 'CodeBuild',
            project,
            input: sourceOutput,
            outputs: [buildOutput]
        })

        const deployAction = new codepipeline_actions.EcsDeployAction({
            actionName: 'ECSAction',
            service: props.service,
            input: buildOutput
        })

        const role = new iam.Role(this, `arbitrage-role`, {
            assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com')
          })
      
          const statement = new iam.PolicyStatement({
            actions: ['cloudformation:GetTemplate']
          })
          statement.addAllResources()
          role.addToPolicy(statement)
      
          const pipelineBucket = new adb.AutoDeleteBucket(this, `arbitrage-pipeline-bucket`)
      
          new codepipeline.Pipeline(this, `arbitrage-pipeline`, {
            artifactBucket: pipelineBucket,
            stages: [
              {
                stageName: 'Source',
                actions: [sourceAction]
              },
              {
                stageName: 'Build',
                actions: [buildAction]
              },
              {
                stageName: 'Deploy',
                actions: [deployAction]
              }
            ]
          })
    }
}
