# Blog Application

This Express and MongoDB app is ready to run locally and can be deployed to AWS with environment-based configuration.

## Environment variables

Create a `.env` file locally or set these values in your AWS environment:

- `PORT` - App port. AWS usually injects this automatically.
- `MONGODB_URI` - Your MongoDB connection string.
- `JWT_SECRET` - A long random string used to sign login tokens.
- `NODE_ENV` - Use `production` in AWS.

Example values are available in [.env.example](D:\NodeJS\09-Blog-Application\.env.example).

## Local run

```bash
npm install
npm run dev
```

## AWS deployment notes

This app is suitable for EC2, Elastic Beanstalk, or ECS.

Before deploying:

1. Set `NODE_ENV=production`
2. Set a real `MONGODB_URI`
3. Set a strong `JWT_SECRET`
4. Run `npm install --production`
5. Start the app with `npm start`

## Important file upload note

Uploaded blog cover images are currently stored on the local server filesystem in `public/uploads`.
That works on a single EC2 instance, but on Elastic Beanstalk or container-based AWS setups those files may be lost when the instance is replaced or redeployed.

For long-term production use, move uploaded images to Amazon S3 instead of local disk storage.
