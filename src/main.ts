import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import serverlessExpress from '@vendia/serverless-express';

import { Callback, Context, Handler } from 'aws-lambda';

const port = process.env.PORT || 4000;

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.init();
  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}
bootstrap().then(() => {
  console.log('App is running on %s port', port);
});

let server: Handler;

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  server = server ?? (await bootstrap());
  return server(event, context, callback);
};
