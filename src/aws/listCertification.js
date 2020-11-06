import 'dotenv-safe/config';
import runFn from '../utils/runFn';
import logger from '../utils/loggers';
import AWS from 'aws-sdk';

const acmParams = {
    CertificateStatuses: [
        // 'PENDING_VALIDATION'
        /* more items */
    ],
};

/* certificateList 목록 불러오기 */
export const getCertificateList = runFn(async (certificateStatus, region) => {
    logger.info('----- start get certificate list -----');
    
    //지역 설정 
    AWS.config.update({region}); 
    const acm = new AWS.ACM({apiVersion: '2015-12-08'}); 

    /* 검증중 상태인 certificate 적용 */
    acmParams.CertificateStatuses.push(certificateStatus);

    /* certificateList 목록 불러오기 */
    const data = await acm.listCertificates(acmParams).promise();
    logger.info('----- success get certificate list -----');
    return data;
})