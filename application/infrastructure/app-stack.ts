import sqs = require('@aws-cdk/aws-sqs')
import events = require('@aws-cdk/aws-events')
import targets = require('@aws-cdk/aws-events-targets')
import ec2 = require('@aws-cdk/aws-ec2')
import ecs = require('@aws-cdk/aws-ecs')
import logs = require('@aws-cdk/aws-logs')
import ecr = require('@aws-cdk/aws-ecr')

import cdk = require('@aws-cdk/core')

export interface AppStackProps extends cdk.StackProps {
    repository: ecr.Repository
}

export class AppStack extends cdk.Stack {
    public readonly service: ecs.BaseService

    constructor(app: cdk.App, id: string, props: AppStackProps) {
        super(app, id, props)

        const vpc = new ec2.Vpc(this, 'main', { maxAzs: 2 })
    
        const cluster = new ecs.Cluster(this, 'arbitrage-workers', { vpc })
        cluster.addCapacity('arbitrage-workers-asg', {
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
            keyName: "arbitrage"
        })

        const logging = new ecs.AwsLogDriver({ streamPrefix: "arbitrage-logs", logRetention: logs.RetentionDays.ONE_DAY })

        const taskDef = new ecs.Ec2TaskDefinition(this, "arbitrage-task")
        taskDef.addContainer("arbitrage-container", {
            image: ecs.ContainerImage.fromEcrRepository(props.repository),
            memoryLimitMiB: 512,
            logging,
        })

        this.service = new ecs.Ec2Service(this, "arbitrage-service", {
            cluster,
            taskDefinition: taskDef,
        })

        const sendExchangePairs = new sqs.Queue(this, 'send-exchange-pairs', {
            queueName: 'send-exchange-pairs'
        })

        new sqs.Queue(this, 'dispatch-with-common-symbols', {
            queueName: 'dispatch-with-common-symbols'
        })

        new sqs.Queue(this, 'assess-arbitrage-opportunity', {
            queueName: 'assess-arbitrage-opportunity'
        })

        const rule = new events.Rule(this, 'arbitrage-cron', {
            schedule: events.Schedule.expression('cron(0 * * ? * *)')
        })
      
        rule.addTarget(new targets.SqsQueue(sendExchangePairs))
    }
}