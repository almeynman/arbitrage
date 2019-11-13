import * as sqs from '@aws-cdk/aws-sqs'
import * as events from '@aws-cdk/aws-events'
import * as targets from '@aws-cdk/aws-events-targets'
import * as ec2 from '@aws-cdk/aws-ec2'
import * as ecs from '@aws-cdk/aws-ecs'
import * as logs from '@aws-cdk/aws-logs'
import * as ecr from '@aws-cdk/aws-ecr'
import * as iam from '@aws-cdk/aws-iam'
import * as dynamodb from '@aws-cdk/aws-dynamodb'

import * as cdk from '@aws-cdk/core'

export interface AppStackArgs {
    app: cdk.App
    id: string
    props: cdk.StackProps
    repository: ecr.IRepository
    appName: string
}

export class AppStack extends cdk.Stack {
    public readonly service: ecs.BaseService

    constructor({ app, id, props, repository, appName }: AppStackArgs) {
        super(app, id, props)
        const user = new iam.User(this, appName, {
          userName: appName
        })
        const accessKey = new iam.CfnAccessKey(this, `${appName}-access-key`, {
          userName: user.userName,
        })

        const assessmentTable = new dynamodb.Table(this, 'assessment', {
         partitionKey: {
           name: 'id',
           type: dynamodb.AttributeType.STRING
         },
         removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production code
        });
        assessmentTable.grantWriteData(user)

        const vpc = new ec2.Vpc(this, 'main', { maxAzs: 2 })

        const cluster = new ecs.Cluster(this, `${appName}-workers`, { vpc })
        cluster.addCapacity(`${appName}-workers-asg`, {
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
        })

        const logging = new ecs.AwsLogDriver({ streamPrefix: `${appName}-logs`, logRetention: logs.RetentionDays.ONE_MONTH })

        const sendExchangePairs = new sqs.Queue(this, 'send-exchange-pairs', {
            queueName: 'send-exchange-pairs'
        })

        const dispatchWithCommonSymbols = new sqs.Queue(this, 'dispatch-with-common-symbols', {
            queueName: 'dispatch-with-common-symbols'
        })

        const assessArbitrageOpportunity = new sqs.Queue(this, 'assess-arbitrage-opportunity', {
            queueName: 'assess-arbitrage-opportunity'
        })

        const taskDef = new ecs.Ec2TaskDefinition(this, `${appName}-task`)
        taskDef.addContainer(`${appName}-container`, {
            image: ecs.ContainerImage.fromEcrRepository(repository),
            memoryLimitMiB: 512,
            logging,
            environment: {
              AWS_ACCESS_KEY_ID: accessKey.ref,
              AWS_SECRET_ACCESS_KEY: accessKey.attrSecretAccessKey,
              AWS_REGION: 'us-east-1',
              SEND_EXCHANGE_PAIRS_QUEUE_URL: sendExchangePairs.queueUrl,
              DISPATCH_WITH_COMMON_SYMBOLS_QUEUE_URL: dispatchWithCommonSymbols.queueUrl,
              ASSESS_QUEUE_URL: assessArbitrageOpportunity.queueUrl,
              DYNAMODB_ASSESSMENT_TABLE_NAME: assessmentTable.tableName
            }
        })

        this.service = new ecs.Ec2Service(this, `${appName}-service`, {
            cluster,
            taskDefinition: taskDef,
        })

        sendExchangePairs.grantConsumeMessages(user)
        dispatchWithCommonSymbols.grantSendMessages(user)
        dispatchWithCommonSymbols.grantConsumeMessages(user)
        assessArbitrageOpportunity.grantConsumeMessages(user)
        assessArbitrageOpportunity.grantSendMessages(user)
        const rule = new events.Rule(this, `${appName}-cron`, {
            schedule: events.Schedule.expression('cron(0 * * ? * *)')
        })

        rule.addTarget(new targets.SqsQueue(sendExchangePairs))
    }
}

