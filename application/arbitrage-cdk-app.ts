const app = new cdk.App()

new AwsEcsStack(app, 'arbitrage-app')

app.synth()