import 'dotenv-safe/config';
import runFn from '../utils/runFn';
import AWS from 'aws-sdk';
import logger from '../utils/loggers';
// Set the region 
AWS.config.update({region: process.env.REGION});

// Create EC2 service object
const ec2 = new AWS.EC2({apiVersion: '2016-11-15'});

const params = {
   /* 키페어 이름 설정 */
   KeyName: process.env.PROJECT_NAME+'_key_pair'
};


/* 키페어 생성 */
export const createKeyPair = runFn(async () => {
   logger.info('----- start create ec2 key pair -----');

   /* 키페어 생성 */
   const data = await ec2.createKeyPair(params).promise();
   logger.info(data.KeyMaterial);
   console.log(data);

   // logger.info(JSON.stringify(data));
   logger.info('----- success create ec2 key pair');
   
   return data;
});

// createKeyPair();