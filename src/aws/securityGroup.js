import 'dotenv-safe/config';
import runFn from '../utils/runFn';
import AWS from 'aws-sdk';
import { getFirstVpc } from './getFirstVpc';
import logger from '../utils/loggers';
// Load credentials and set region from JSON file
AWS.config.update({region: process.env.REGION});

// Create EC2 service object
var ec2 = new AWS.EC2({apiVersion: '2016-11-15'});

/* 가장 첫번째 VPC로 연결합니다 */
var paramsIngress = {
GroupId: "",
IpPermissions:[
    {
        IpProtocol: "tcp",
        FromPort: 80,
        ToPort: 80,
        IpRanges: [{"CidrIp":"0.0.0.0/0"}]
    },
    {
        IpProtocol: "tcp",
        FromPort: 22,
        ToPort: 22,
        IpRanges: [{"CidrIp":"0.0.0.0/0"}]
    }
]
};

var paramsSecurityGroup = {
    Description: process.env.PROJECT_NAME,
    GroupName: '',
    VpcId: ""
};

/* 보안그룹 생성 */
export const createSecurityGroup = runFn(async (GroupName) => {
    logger.info('----- start create security group -----');

    /* vpc 불러오기 */
    const vpc = await getFirstVpc();

    /* vpcId, vpcGroupName 적용 */
    paramsSecurityGroup.VpcId = vpc;
    paramsSecurityGroup.GroupName = GroupName;

    /* 보안그룹 생성 */
    const data = await ec2.createSecurityGroup(paramsSecurityGroup).promise();

    /* 인바운드 규칙 추가 할 id */
    const securityGroupId = data.GroupId;

    logger.info('----- success create security group -----');
    
    return securityGroupId;
    // await authorizeSecurityGroupIngress(securityGroupId);
});


/* 인바운드 규칙 추가 */
export const authorizeSecurityGroupIngress = runFn(async (securityGroupId) => {
    logger.info('----- start authorize group ingress -----');


    paramsIngress.GroupId = securityGroupId;

    /* 규칙 추가 */
    const data = await ec2.authorizeSecurityGroupIngress(paramsIngress).promise();
    // logger.info("Ingress Successfully Set", data);
    logger.info('----- success authorize group ingress -----');

    return data;
});

// describeVpcs();

const getSecurityGroup = runFn(async () => {

});