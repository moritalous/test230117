import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'CdkQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    const bucket = new cdk.aws_s3.Bucket(this, 'bucket')

    const distribution = new cdk.aws_cloudfront.Distribution(this, 'distribution', {
      defaultBehavior: {
        origin: new cdk.aws_cloudfront_origins.S3Origin(bucket)
      },
      defaultRootObject: 'index.html'
    })

    new cdk.aws_s3_deployment.BucketDeployment(this, 'deploy', {
      sources: [cdk.aws_s3_deployment.Source.asset('../build')],
      destinationBucket: bucket,
      distribution: distribution,
      distributionPaths: ['/']
    })

    new cdk.CfnOutput(this, 'bucket_bucketName', { value: bucket.bucketName })
    new cdk.CfnOutput(this, 'distribution_domainName', { value: distribution.domainName })

  }
}
