import sqs = require('@aws-cdk/aws-sqs')
import events = require('@aws-cdk/aws-events')
import targets = require('@aws-cdk/aws-events-targets')
import ec2 = require('@aws-cdk/aws-ec2')
import ecs = require('@aws-cdk/aws-ecs')
import logs = require('@aws-cdk/aws-logs')
import ecr = require('@aws-cdk/aws-ecr')
import iam = require('@aws-cdk/aws-iam')
import dynamodb = require('@aws-cdk/aws-dynamodb')

import cdk = require('@aws-cdk/core')

export interface AppStackProps extends cdk.StackProps {
    repository: ecr.IRepository
}

export class AppStack extends cdk.Stack {
    public readonly service: ecs.BaseService

    constructor(app: cdk.App, id: string, props: AppStackProps) {
        super(app, id, props)
        const arbitrageAppName = 'arbitrage-app'
        const user = new iam.User(this, 'arbitrage-app', {
          userName: arbitrageAppName
        })
        const accessKey = new iam.CfnAccessKey(this, 'arbitrage-app-access-key', {
          userName: user.userName,
        })

        const opportunityTable = new dynamodb.Table(this, 'opportunity', {
         partitionKey: {
           name: 'id',
           type: dynamodb.AttributeType.STRING
         },
         removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production code
       });
        
        const vpc = new ec2.Vpc(this, 'main', { maxAzs: 2 })
    
        const cluster = new ecs.Cluster(this, 'arbitrage-workers', { vpc })
        cluster.addCapacity('arbitrage-workers-asg', {
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
            keyName: "arbitrage"
        })

        const logging = new ecs.AwsLogDriver({ streamPrefix: "arbitrage-logs", logRetention: logs.RetentionDays.ONE_DAY })

        const sendExchangePairs = new sqs.Queue(this, 'send-exchange-pairs', {
            queueName: 'send-exchange-pairs'
        })

        const dispatchWithCommonSymbols = new sqs.Queue(this, 'dispatch-with-common-symbols', {
            queueName: 'dispatch-with-common-symbols'
        })

        const assessArbitrageOpportunity = new sqs.Queue(this, 'assess-arbitrage-opportunity', {
            queueName: 'assess-arbitrage-opportunity'
        })

        const taskDef = new ecs.Ec2TaskDefinition(this, "arbitrage-task")
        taskDef.addContainer("arbitrage-container", {
            image: ecs.ContainerImage.fromEcrRepository(props.repository),
            memoryLimitMiB: 512,
            logging,
            environment: {
              AWS_ACCESS_KEY_ID: accessKey.ref,
              AWS_SECRET_ACCESS_KEY: accessKey.attrSecretAccessKey,
              AWS_REGION: 'us-east-1',
              SEND_EXCHANGE_PAIRS_QUEUE_URL: sendExchangePairs.queueUrl,
              DISPATCH_WITH_COMMON_SYMBOLS_QUEUE_URL: dispatchWithCommonSymbols.queueUrl,
              ASSESS_QUEUE_URL: assessArbitrageOpportunity.queueUrl,
            }
        })

        this.service = new ecs.Ec2Service(this, "arbitrage-service", {
            cluster,
            taskDefinition: taskDef,
        })

        const rule = new events.Rule(this, 'arbitrage-cron', {
            schedule: events.Schedule.expression('cron(0 * * ? * *)')
        })
      
        rule.addTarget(new targets.SqsQueue(sendExchangePairs))
    }
}

