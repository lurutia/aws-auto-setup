import 'dotenv-safe/config';
import runFn from '../utils/runFn';
import AWS from 'aws-sdk';
import logger from '../utils/loggers';
// Set the Region 
AWS.config.update({region: process.env.REGION});

// Create S3 service object
const s3 = new AWS.S3({apiVersion: '2006-03-01'});

// Create the parameters for calling createBucket
var bucketParams = {
  Bucket : process.env.PROJECT_NAME+'-frontend'
};

/* s3 버킷 생성 */
export const createS3Bucket = runFn(async () => {
  logger.info('----- start create s3 bucket -----');

  /* s3 버킷 생성 */
  const data = await s3.createBucket(bucketParams).promise();
  // logger.info("Success", data.Location);
  logger.info('----- success create s3 bucket');
  return data;
});

// createS3Bucket();