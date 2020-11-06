import 'dotenv-safe/config';
import runFn from '../utils/runFn';
import AWS from 'aws-sdk';
import logger from '../utils/loggers';

AWS.config.update({region: process.env.REGION})

const ec2 = new AWS.EC2({ apiVersion: '2016-11-15'});

// const securityGroupId = 'sg-001230d322e193c66';
const ec2RunInstanceParam = {
    KeyName: process.env.PROJECT_NAME+'_key_pair',
    SecurityGroupIds: [
        // sg-001230d322e193c66
    ],
    MaxCount: 1,
    MinCount: 1,
    ImageId: "ami-03b42693dc6a7dc35",   /* AMI 선택 */
    InstanceType: "t2.micro",           /* 인스턴스 유형(성능) */
    BlockDeviceMappings: [
        {
            DeviceName: "/dev/xvda",
            Ebs: {
                VolumeSize: 30,
                VolumeType: "gp2"
            }
        }
    ],
    // Monitoring: {
    //     Enabled: false
    // },
    TagSpecifications: [
        {
            ResourceType: "instance",
            Tags: [
                {
                    Key: "Name",
                    Value: process.env.PROJECT_NAME
                }
            ]
        }
    ]
}

/* ec2 인스턴스 시작 */
export const ec2RunInstances = runFn(async (securityGroupId) => {
    logger.info('----- start ec2 run Instance -----');
    
    /* ec2 인스턴스 시작 */
    ec2RunInstanceParam.SecurityGroupIds.push(securityGroupId);
    const data = await ec2.runInstances(ec2RunInstanceParam).promise();

    logger.info('----- success ec2 run Instance -----');
    return data;
})

// ec2RunInstances();


/* 인스턴스 목록 불러오기 */
// const ec2DescribeInstances = runFn(async () => {
//     const data = await ec2.describeInstances({}).promise();

//     /* 불러온 인스턴스 중 동일한 인스턴스 찾기 */
//     data.Reservations.forEach(elm => logger.info(elm.Instances));
// });

// ec2DescribeInstances();