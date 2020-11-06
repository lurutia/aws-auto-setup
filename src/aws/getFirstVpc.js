import 'dotenv-safe/config';
import runFn from '../utils/runFn';
import AWS from 'aws-sdk';
import logger from '../utils/loggers';
// Load credentials and set region from JSON file
AWS.config.update({region: process.env.REGION});

// Create EC2 service object
const ec2 = new AWS.EC2({apiVersion: '2016-11-15'});

/* 첫번째 vpcId 찾기 */
export const getFirstVpc = runFn(async () => {
  logger.info('----- start get describe vpc list -----');
  // Retrieve the ID of a VPC

  /* vpc목록 불러오기 */
  const data = await ec2.describeVpcs().promise();
  
  /* vpcId 불러오기 */
  /* 한개밖에 없으니까 첫번째 vpcId */
  const vpc = data.Vpcs[0].VpcId;

  logger.info('----- success get describe vpc list -----');
  return vpc;
});