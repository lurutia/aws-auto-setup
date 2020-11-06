import 'dotenv-safe/config';
import AWS from 'aws-sdk';
import logger from './utils/loggers';
import { createHostedZone } from './aws/route53Setup';
import { createAcm } from './aws/acmSetup';
import { createKeyPair } from './aws/ec2KeyPair';
import { createSecurityGroup } from './aws/securityGroup';
import { createS3Bucket } from './aws/s3Setup';
import { createDistribution } from './aws/cloudFrontSetup';
import { createElbv2LoadBalancer } from './aws/elasticLoadBalancerSetup';
import { getFirstVpc } from './aws/getFirstVpc';
import { listRoute53HostedZones } from './aws/authorizeAcmRoute53';

// AWS.config.update({region: "us-east-1"});

/* --------------------------------------------------------- */
/* 새로운 프로젝트를 시작합니다. */
/* -- route53               */
/* -- certification         */
/* -- certification 인증    */
/* -- ec2 키페어            */
/* -- ec2 보안그룹          */
/* -- ec2 생성              */
/* -- s3                    */
/* -- cloudfrontd           */
/* -- ec2 loadbalancer      */
/* 1. ec2.vpc 로 vpc 목록구함                   */
/* 2. 보안그룹생성                              */
/* 3. 보안그룹에 포트 할당                      */
/* 4. loadbalancer create                      */
/* 5. acm 목록 불러오기                         */
/* 6. 타겟그룹 생성                             */
/* 7. ELB, ACM, TargetGroup connect(listener) */
/* --------------------------------------------------------- */

const main = async () => {
    // /* Route53 생성 생성 */
    // await createHostedZone();

    // /* certification 생성 */
    // await createAcm(process.env.REGION);
    // await createAcm("us-east-1");

    // /* certification 인증 */
    // await createAuthorizeRecordSets();

    // /* EC2 Key Pair 생성 */
    // await createKeyPair();

    // /* EC2 보안그룹 생성 */
    // await createSecurityGroup(process.env.PROJECT_NAME+"_ec2_security_group"); 


    // /* EC2 생성 */

    // /* S3 Bucket 생성 */
    // await createS3Bucket();

    // /* CloudFront distribution 생성 */
    // await createDistribution();

    // /* create LoadBalancer */
    // await createSecurityGroup(process.env.PROJECT_NAME+"_loadbalancer_security_group");
    // await createElbv2LoadBalancer();

    console.log(await getFirstVpc());
}

main();
