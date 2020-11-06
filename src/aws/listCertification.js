import 'dotenv-safe/config';
import runFn from '../utils/runFn';
import logger from '../utils/loggers';

var acmParams = {
    CertificateStatuses: [
        // 'PENDING_VALIDATION'
        /* more items */
    ],
};

/* certificateList 목록 불러오기 */
export const getCertificateList = runFn(async (certificateStatus) => {
    logger.info('----- start get certificate list -----');
    
    /* 검증중 상태인 certificate 적용 */
    acmParams.CertificateStatuses.push(certificateStatus);

    /* certificateList 목록 불러오기 */
    const data = await acm.listCertificates(acmParams).promise();
    logger.info('----- success get certificate list -----');
    return data;
})