import 'dotenv-safe/config';
import AWS from 'aws-sdk';
import runFn from '../utils/runFn';
import logger from '../utils/loggers';

/* 설정 */
var params = {
    DomainName: process.env.PROJECT_NAME+process.env.DNS, /* required */
    // CertificateAuthorityArn: 'arn:aws:acm-pca:region:account:certificate-authority/12345678-1234-1234-1234-123456789012',
    DomainValidationOptions: [
        {
            DomainName: process.env.PROJECT_NAME+process.env.DNS, /* required */
            ValidationDomain: process.env.PROJECT_NAME+process.env.DNS /* required */
        },
        /* more items */
    ],
    // IdempotencyToken: 'STRING_VALUE',
    // Options: {
    //     CertificateTransparencyLoggingPreference: ENABLED | DISABLED
    // },
    SubjectAlternativeNames: [
        '*.'+process.env.PROJECT_NAME+process.env.DNS,
        /* more items */
    ],
    Tags: [
        {
            Key: 'name', /* required */
            Value: process.env.PROJECT_NAME+"_certificate"
        },
        /* more items */
    ],
    ValidationMethod: 'DNS'
};

/* certificate manager 생성 */
export const createAcm = runFn(async (region) => {
    logger.info('----- start create AmazonCertificateManager -----');
    //지역 설정 
    AWS.config.update({region}); 
    const acm = new AWS.ACM({apiVersion: '2015-12-08'}); 

    //acm 생성
    const data = await acm.requestCertificate(params).promise();

    logger.info('----- success create AmazonCertificateManager');
    return data;
})

// createAcm();