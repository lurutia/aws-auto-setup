import 'dotenv-safe/config';
import runFn from '../utils/runFn';
import AWS from 'aws-sdk';
import logger from '../utils/loggers';

AWS.config.update({region: process.env.REGION})

var ec2 = new AWS.EC2({ apiVersion: '2016-11-15'});

var securityGroupId = 'sg-001230d322e193c66';


const ec2RunInstanceParam = {
    KeyName: process.env.PROJECT_NAME+'_key_pair',
    SecurityGroupIds: [
        securityGroupId,
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
const ec2RunInstances = runFn(async () => {
    /* ec2 인스턴스 시작 */
    const data = await ec2.runInstances(ec2RunInstanceParam).promise();
})

// ec2RunInstances();


/* 인스턴스 목록 불러오기 */
const ec2DescribeInstances = runFn(async () => {
    const data = await ec2.describeInstances({}).promise();

    /* 불러온 인스턴스 중 동일한 인스턴스 찾기 */
    data.Reservations.forEach(elm => logger.info(elm.Instances));
});

// ec2DescribeInstances();