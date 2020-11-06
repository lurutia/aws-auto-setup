import 'dotenv-safe/config';
import runFn from '../utils/runFn';
import AWS from 'aws-sdk';
import * as uuid from 'uuid';
import logger from '../utils/loggers';

const route53 = new AWS.Route53({apiVersion: '2013-04-01'});

const params = {
    CallerReference: uuid.v4(), /* required */
    Name: process.env.PROJECT_NAME+process.env.DNS, /* required */
    // DelegationSetId: 'STRING_VALUE',
    // HostedZoneConfig: {
    //     Comment: 'STRING_VALUE',
    //     PrivateZone: true || false
    // },
    // VPC: {
    //     VPCId: 'STRING_VALUE',
    //     VPCRegion: us-east-1 | us-east-2 | us-west-1 | us-west-2 | eu-west-1 | eu-west-2 | eu-west-3 | eu-central-1 | ap-east-1 | me-south-1 | us-gov-west-1 | us-gov-east-1 | us-iso-east-1 | us-isob-east-1 | ap-southeast-1 | ap-southeast-2 | ap-south-1 | ap-northeast-1 | ap-northeast-2 | ap-northeast-3 | eu-north-1 | sa-east-1 | ca-central-1 | cn-north-1 | af-south-1 | eu-south-1
    // }
};


/* route53 생성 */
export const createHostedZone = runFn(async () => {
    logger.info('----- create Route53 HostedZone -----');
    
    /* route53 생성 */
    const data = await route53.createHostedZone(params).promise();

    logger.info('----- success created Route53 Hosted Zone ----');
    return data;
});

// createHostedZone();