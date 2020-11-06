import 'dotenv-safe/config';
import runFn from '../utils/runFn';
import AWS from 'aws-sdk';
import { getFirstVpc } from './getFirstVpc';
import logger from '../utils/loggers';

AWS.config.update({region: process.env.REGION})
var elbv2 = new AWS.ELBv2({apiVersion: '2015-12-01'});


var params = {
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

var paramsIngressParams = {
    GroupId: '',
    IpPermissions:[
    {
        IpProtocol: "tcp",
        FromPort: 443,
        ToPort: 443,
        IpRanges: [{"CidrIp":"0.0.0.0/0"}]
    },
    ]
};

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

var elbv2ListenerParams = {
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
export const createElbv2LoadBalancer = runFn(async () => {
    logger.info('----- start create elbv2 loadbalancer -----');

    /* loadBalancer 생성 */
    const data = await elbv2.createLoadBalancer(params).promise();

    /* 방금 생성한 loadBalancer의 arn 불러오기 */
    elbv2ListenerParams.LoadBalancerArn = data.LoadBalancers[0].LoadBalancerArn;

    /* ISSUED 상태인 certificate 불러오기 */
    const certificateList = await getCertificateList("ISSUED");

    /* certificateList에서 도메인명과 일치하는 acm의 arn 찾기 */
    var finder = certificateList.CertificateSummaryList.find(certificate => {
        return certificate.DomainName === process.env.PROJECT_NAME+process.env.DNS;
    });

    /* 방금 찾은 arn 적용 */
    elbv2ListenerParams.Certificates[0].CertificateArn = finder.CertificateArn;
    logger.info('----- success create elbv2 loadbalancer -----');
    await createTargetGroup();
});

/* 타겟 그룹 생성 */
const createTargetGroup = runFn(async () => {
    logger.info('----- start create target ec2 group -----');

    /* 첫번째 vpc 불러와서 targetGroup vpcId에 적용 */
    const vpc = await getFirstVpc();
    targetGroupParams.VpcId = vpc;

    /* 타겟 그룹 생성 */
    const data = await elbv2.createTargetGroup(targetGroupParams).promise();
    // logger.info(data);           // successful response

    /* 방금 생성한 타겟 그룹 arn을 elbv2ListenerParams의 targetGroupArn에 적용 */
    elbv2ListenerParams.DefaultActions[0].TargetGroupArn = data.TargetGroups[0].TargetGroupArn;
    logger.info('----- success create target ec2 group -----');
    await createElb2Listener();
});

/* 로드밸런서 리스너 생성 */
const createElb2Listener = runFn(async () => {
    logger.info('----- start create elb2 listener -----');

    /* 리스너 생성 */
    const data = await elbv2.createListener(elbv2ListenerParams).promise();
    logger.info('----- success create elb2 listener -----');
    return data;
})

// ec2DescribeVpcs();