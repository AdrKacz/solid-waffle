import { StackContext, StaticSite, Bucket, Api } from "sst/constructs";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import { RemovalPolicy } from "aws-cdk-lib";

export function Stack({ stack }: StackContext) {
  const bucket = new Bucket(stack, "bucket", {
    cdk: {
      bucket: {
        autoDeleteObjects: true,
        removalPolicy: RemovalPolicy.DESTROY,
      },
    },
  });

  new s3deploy.BucketDeployment(stack, "QuoteDeployment", {
    sources: [s3deploy.Source.asset(`../quotes/`)],
    destinationBucket: bucket.cdk.bucket,
    destinationKeyPrefix: "quotes",
  });

  const api = new Api(stack, 'api', {
    defaults: { function: { bind: [bucket] } },
    routes: {
      "GET /quote": "packages/api/src/get/quote.handler",
      "GET /quote/{id}": "packages/api/src/get/quote.handler"
    },
  })

  const web = new StaticSite(stack, "web", {
    path: "packages/web",
    buildOutput: "dist",
    buildCommand: "npm run build",
    customDomain: stack.stage === 'prod' ? {
      domainName: 'macronoupasmacron.fr',
      domainAlias: `www.macronoupasmacron.fr`,
    } : undefined,
    environment: { VITE_APP_API_URL: api.url }
  });

  stack.addOutputs({
    "Api URL": api.url,
    "Web URL": web.customDomainUrl || web.url,
  });
}
