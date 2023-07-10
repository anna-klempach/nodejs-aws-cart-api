import * as cdk from "aws-cdk-lib";
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { resolve } from "path";

const app = new cdk.App();

const PREFLIGHT_PROPS = {
  allowOrigins: ['*'],
  allowHeaders: ['*'],
  allowMethods: apigateway.Cors.ALL_METHODS
};

const stack = new cdk.Stack(app, "HKLNestJsLambdaStack", {
  env: { region: "us-east-1" },
});
const nestLambdaFunction = new lambda.Function(stack, 'nestLambdaFunction', {
  runtime: lambda.Runtime.NODEJS_18_X,
  code: lambda.Code.fromAsset(resolve(__dirname, './dist'), {
    exclude: ['node_modules'],
  }),
  handler: 'main.handler'
});

const api = new apigateway.RestApi(stack, 'nest-api', {
  restApiName: "Nest Service",
  description: "This is Nest service wrapper."
});
api.root.addMethod('ANY', new apigateway.LambdaIntegration(nestLambdaFunction));
api.root.addCorsPreflight(PREFLIGHT_PROPS);
const cartApi = api.root.addResource('api').addResource('profile').addResource('cart');
cartApi.addMethod('ANY', new apigateway.LambdaIntegration(nestLambdaFunction));
cartApi.addCorsPreflight(PREFLIGHT_PROPS);
