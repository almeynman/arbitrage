import cdk = require('@aws-cdk/core')
import sns = require('@aws-cdk/aws-sns')
import events = require('@aws-cdk/aws-events')
import targets = require('@aws-cdk/aws-events-targets')
import ec2 = require('@aws-cdk/aws-ec2')
import ecs = require('@aws-cdk/aws-ecs')
import ecr = require('@aws-cdk/aws-ecr')
import logs = require('@aws-cdk/aws-logs')

export class AwsEcsStack extends cdk.Stack {
    constructor(app: cdk.App, id: string) {
        super(app, id)

        const vpc = new ec2.Vpc(this, 'main', { maxAzs: 2 })
    
        const cluster = new ecs.Cluster(this, 'arbitrage-workers', { vpc })
        cluster.addCapacity('arbitrage-workers-asg', {
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO)
        })

        const logging = new ecs.AwsLogDriver({ streamPrefix: "arbitrage-logs", logRetention: logs.RetentionDays.ONE_DAY })

        const repository = new ecr.Repository(this, 'arbitrage-builds')
        repository.addLifecycleRule({ tagPrefixList: ['prod'], maxImageCount: 100 })
        repository.addLifecycleRule({ maxImageAge: cdk.Duration.days(30) })

        const taskDef = new ecs.Ec2TaskDefinition(this, "arbitrage-task")
        taskDef.addContainer("arbitrage-container", {
            image: ecs.ContainerImage.fromEcrRepository(repository),
            memoryLimitMiB: 512,
            logging,
        })

        new ecs.Ec2Service(this, "arbitrage-service", {
            cluster,
            taskDefinition: taskDef,
        })

        const sendExchangePairs = new sns.Topic(this, 'send-exchange-pairs', {
            topicName: 'send-exchange-pairs',
            displayName: 'Combine all known exchange in pairs'
        })

        new sns.Topic(this, 'dispatch-with-common-symbols', {
            topicName: 'dispatch-with-common-symbols',
            displayName: 'Dispatch common symbols to be assessed'
        })

        new sns.Topic(this, 'assess-arbitrage-opportunity', {
            topicName: 'assess-arbitrage-opportunity',
            displayName: 'Assess arbitrage opportunity'
        })

        const rule = new events.Rule(this, 'arbitrage-cron', {
            schedule: events.Schedule.expression('cron(0 * * ? * *)')
          })
      
        rule.addTarget(new targets.SnsTopic(sendExchangePairs))
    }
}