import 'dotenv-safe/config';
import { createHostedZone } from './aws/route53Setup';
import { createAcm } from './aws/acmSetup';
import { createKeyPair } from './aws/ec2KeyPair';
import { createSecurityGroup, authorizeSecurityGroupIngress } from './aws/securityGroup';
import { createS3Bucket } from './aws/s3Setup';
import { createDistribution } from './aws/cloudFrontSetup';
import { createElb2Listener, createElbv2LoadBalancer, createTargetGroup, describeLoadBalancers } from './aws/elasticLoadBalancerSetup';
import { createAuthorizeRecordSets } from './aws/authorizeAcmRoute53';
import { ec2RunInstances } from './aws/ec2Setup';
import { createRecordSet } from './aws/createRoute53Record';
import AWS from 'aws-sdk';

AWS.config.update({region: process.env.REGION});
const cloudfront = new AWS.CloudFront({apiVersion: '2020-05-31'});
const elbv2 = new AWS.ELBv2({apiVersion: '2015-12-01'});

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

    // /* Route53 생성 */
    // const route53Data = await createHostedZone();
    // const hostedZoneId = route53Data.HostedZone.Id;

    // /* certification 생성 */
    // await createAcm(process.env.REGION);
    // await createAcm("us-east-1");

    // /* certification 인증 */
    // await createAuthorizeRecordSets();

    // /* EC2 Key Pair 생성 */
    // await createKeyPair();

    // /* EC2 보안그룹 생성 */
    // const securityGroupId = await createSecurityGroup(process.env.PROJECT_NAME+"_ec2_security_group"); 
    
    // /** EC2 보안그룹 인바운드규칙 추가 */
    // await authorizeSecurityGroupIngress(securityGroupId);

    // /* EC2 생성 */
    // await ec2RunInstances(securityGroupId);

    // /* S3 Bucket 생성 */
    // await createS3Bucket();


/* --------------------------------------------------------- */


    /* CloudFront distribution 생성 */
    const cloudFrontData = await createDistribution();
    const cloudFrontDomainName = cloudFrontData.Distribution.DomainName;

    /* LoadBalancer 생성 */
    const loadBalancerSecurityGroupId = await createSecurityGroup(process.env.PROJECT_NAME+"_loadbalancer_security_group");
    const loadBalancerData = await createElbv2LoadBalancer(loadBalancerSecurityGroupId);
    /* 방금 생성한 loadBalancer의 arn 불러오기 */
    const loadBalancerArn = loadBalancerData.LoadBalancers[0].LoadBalancerArn;
    const loadBalancerDnsName = loadBalancerData.LoadBalancers[0].DNSName;

    /* load balancer hosted zone id 불러오기 */
    const describeLoadBalancerData = await describeLoadBalancers(loadBalancerArn);
    const loadBalancerHostedZoneId = describeLoadBalancerData.LoadBalancers[0].CanonicalHostedZoneId;

    /* load balancer ec2 target group 생성 */
    const targetGroupData = await createTargetGroup();
    /* 타겟 그룹 arn */
    const targetGroupArn = targetGroupData.TargetGroups[0].TargetGroupArn;
   
    /* load balancer listener 생성 */
    await createElb2Listener(loadBalancerArn, targetGroupArn);
    
    /* route53 record sets 생성 */
    await createRecordSet(process.env.PROJECT_NAME+process.env.DNS, cloudFrontDomainName, '');
    await createRecordSet("www."+process.env.PROJECT_NAME+process.env.DNS, cloudFrontDomainName, '');
    await createRecordSet("api."+process.env.PROJECT_NAME+process.env.DNS, loadBalancerDnsName, loadBalancerHostedZoneId);
}

main();
