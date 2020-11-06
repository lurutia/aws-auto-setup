import 'dotenv-safe/config';
import runFn from '../utils/runFn';
import AWS from 'aws-sdk';
import { getFirstVpc } from './getFirstVpc';
import logger from '../utils/loggers';
import { getCertificateList } from './listCertification';

AWS.config.update({region: process.env.REGION})
const elbv2 = new AWS.ELBv2({apiVersion: '2015-12-01'});


const params = {
    Name: process.env.PROJECT_NAME+"-load-balancer", /* required */
    // CustomerOwnedIpv4Pool: 'STRING_VALUE',
    // IpAddressType: ipv4 | dualstack,
    Scheme: 'internet-facing',
    SecurityGroups: [],
    // SubnetMappings: [],
    Subnets: [
        "subnet-cd0259a5",
        "subnet-58bd4f23",
        "subnet-92d856de",
        "subnet-1c530b40"
    ],
    Tags: [
        {
            Key: 'Name', /* required */
            Value: process.env.PROJECT_NAME+"-load-balancer"
        },
        /* more items */
    ],
    Type: 'application'
};

// var paramsSecurityGroup = {
//     Description: process.env.PROJECT_NAME+' loadbalancer group',
//     GroupName: process.env.PROJECT_NAME+'_loadbalancer_group',
//     VpcId: ''
// };

// const paramsIngressParams = {
//     GroupId: '',
//     IpPermissions:[
//     {
//         IpProtocol: "tcp",
//         FromPort: 443,
//         ToPort: 443,
//         IpRanges: [{"CidrIp":"0.0.0.0/0"}]
//     },
//     ]
// };

// var acmParams = {
//     CertificateStatuses: [
//         'ISSUED',
//         /* more items */
//     ],
// };

var targetGroupParams = {
    Name: process.env.PROJECT_NAME+"-target-group", /* required */
    HealthCheckEnabled: true,
    HealthCheckIntervalSeconds: 30,
    HealthCheckPath: '/',
    // HealthCheckPort: 'STRING_VALUE',
    HealthCheckProtocol: 'HTTP',
    HealthCheckTimeoutSeconds: 5,
    HealthyThresholdCount: 5,
    // Matcher: {
    //     GrpcCode: 'STRING_VALUE',
    //     HttpCode: 'STRING_VALUE'
    // },
    Port: 80,
    Protocol: 'HTTP',
    // ProtocolVersion: 'HTTP1',
    Tags: [
        {
            Key: 'Name', /* required */
            Value: process.env.PROJECT_NAME + '_target_group'
        },
        /* more items */
    ],
    TargetType: 'instance',
    UnhealthyThresholdCount: 2, 
    VpcId: ''
};

const elbv2ListenerParams = {
    Certificates: [
        {
            CertificateArn: ""
        }
    ], 
    DefaultActions: [
        {
            TargetGroupArn: "", 
            Type: "forward"
        }
    ], 
    LoadBalancerArn: '', 
    Port: 443, 
    Protocol: "HTTPS", 
    SslPolicy: "ELBSecurityPolicy-2016-08"
};


/* loadBalancer 생성 */
export const createElbv2LoadBalancer = runFn(async (securityGroupId) => {
    logger.info('----- start create elbv2 loadbalancer -----');

    params.SecurityGroups.push(securityGroupId)

    /* loadBalancer 생성 */
    const data = await elbv2.createLoadBalancer(params).promise();

    logger.info('----- success create elbv2 loadbalancer -----');
    return data;
});

/* 타겟 그룹 생성 */
export const createTargetGroup = runFn(async () => {
    logger.info('----- start create target ec2 group -----');
    

    /* 첫번째 vpc 불러와서 targetGroup vpcId에 적용 */
    const vpc = await getFirstVpc();
    targetGroupParams.VpcId = vpc;

    /* 타겟 그룹 생성 */
    const data = await elbv2.createTargetGroup(targetGroupParams).promise();
    // logger.info(data);           // successful response

    logger.info('----- success create target ec2 group -----');
    return data;

    // await createElb2Listener();
});

/* 로드밸런서 리스너 생성 */
export const createElb2Listener = runFn(async (loadBalancerArn, targetGroupArn) => {
    logger.info('----- start create elb2 listener -----');

    /* ISSUED 상태인 certificate 불러오기 */
    const certificateList = await getCertificateList("ISSUED", process.env.REGION);

    /* certificateList에서 도메인명과 일치하는 acm의 arn 찾기 */
    var finder = certificateList.CertificateSummaryList.find(certificate => {
        return certificate.DomainName === process.env.PROJECT_NAME+process.env.DNS;
    });

    /* certificate arn 적용 */
    elbv2ListenerParams.Certificates[0].CertificateArn = finder.CertificateArn;
    /* load balancer arn 적용 */
    elbv2ListenerParams.LoadBalancerArn = loadBalancerArn; 
    /* target group arn 적용 */
    elbv2ListenerParams.DefaultActions[0].TargetGroupArn = targetGroupArn;

    /* 리스너 생성 */
    const data = await elbv2.createListener(elbv2ListenerParams).promise();
    logger.info('----- success create elb2 listener -----');
    return data;
})


const describeLoadBalancerParams = {
    LoadBalancerArns: []
};

export const describeLoadBalancers = runFn(async (arn) => {
    logger.info('----- start describe load balancer -----');

    describeLoadBalancerParams.LoadBalancerArns.push(arn);
    const data = await elbv2.describeLoadBalancers(describeLoadBalancerParams).promise();

    logger.info('----- success describe load balancer -----');

    return data;
});

// ec2DescribeVpcs();