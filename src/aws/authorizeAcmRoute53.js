import 'dotenv-safe/config';
import AWS from 'aws-sdk';
import runFn from '../utils/runFn';
import logger from '../utils/loggers';
import { getCertificateList } from './listCertification';

// Set the region 
AWS.config.update({region: process.env.REGION});

const acm = new AWS.ACM({apiVersion: '2015-12-08'});
const route53 = new AWS.Route53({apiVersion: '2013-04-01'});

const ResourceRecordType = "CNAME";

const describeAcmParams = {
    CertificateArn: "" /* required */
};

const recordSetParams = {
    ChangeBatch: {
        Changes: [
            {
                Action: "CREATE", 
                ResourceRecordSet: {
                    Name: "", 
                    ResourceRecords: [
                    {
                        Value: ""
                    }
                    ], 
                    TTL: 300, 
                    Type: ResourceRecordType
                }
            }
        ], 
        Comment: ""
    }, 
    HostedZoneId: ""
};


/* acm 인증서 상세설명 불러오기 */
const describeAcm = runFn(async () => {
    logger.info('----- start describe acm -----');

    /* 검증중인 acm 불러오기 */
    const certificateList = await getCertificateList("PENDING_VALIDATION", process.env.REGION);

    /* 도메인명이랑 같은 acm 찾기 */
    const finder = certificateList.CertificateSummaryList.find(certificate => {
        return certificate.DomainName === process.env.PROJECT_NAME+process.env.DNS;
    });
    // logger.info(finder);

    /* 찾은 검증중인 acm arn을 describeAcmParams에 acm arn 적용 */
    describeAcmParams.CertificateArn = finder.CertificateArn;

    /* acm 상세 명세 불러오기 */
    const data = await acm.describeCertificate(describeAcmParams).promise();
    // logger.info(data.Certificate.DomainValidationOptions);           // successful response

    logger.info('----- success describe acm -----');
    return data;
});


/* route53 list 불러오기 */
export const listRoute53HostedZones = runFn(async () => {
    logger.info('----- start get route53 hosted zone list -----');

    /* route53 목록 불러오기 */
    const data = await route53.listHostedZones({}).promise();
    // logger.info(data);           // successful response

    /* 호스팅영역명과 일치하는 route53찾기 */
    const findData = data.HostedZones.find(hostedZone => {
        return hostedZone.Name === (process.env.PROJECT_NAME+process.env.DNS+'.')
    });

    /*  findData overView
        {
            Id: '/hostedzone/Z09427381VOZJOCZASVG9',
            Name: 'u-dam.co.kr.',
            CallerReference: 'ec88bc8f-e820-4a21-be54-0690c37573da',
            Config: { Comment: '', PrivateZone: false },
            ResourceRecordSetCount: 6
        }
    */
    const hostedZoneId = findData.Id.split('/')[2];

    logger.info('----- success get route53 hosted zone list -----');
    return hostedZoneId;
})

/* 호스팅 영역 세부 레코드 생성 */
export const createAuthorizeRecordSets = runFn(async () => {
    logger.info('----- start authorize create record sets -----');
    /* acm 설명 */
    const acmDescribeData = await describeAcm();
    // console.log(acmDescribeData);
    recordSetParams.ChangeBatch.Changes[0].ResourceRecordSet.Name = acmDescribeData.Certificate.DomainValidationOptions[0].ResourceRecord.Name;
    recordSetParams.ChangeBatch.Changes[0].ResourceRecordSet.ResourceRecords[0].Value = acmDescribeData.Certificate.DomainValidationOptions[0].ResourceRecord.Value;

    /* route53 목록 불러오기 */
    const hostedZoneId = await listRoute53HostedZones();
    recordSetParams.HostedZoneId = hostedZoneId;

    /* 레코드 생성 */
    await route53.changeResourceRecordSets(recordSetParams).promise();
    logger.info('----- success authorize create record sets -----');
})


// describeAcm();