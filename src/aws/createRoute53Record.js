import 'dotenv-safe/config';
import runFn from '../utils/runFn';
import AWS from 'aws-sdk';
import logger from '../utils/loggers';
import { listRoute53HostedZones } from './authorizeAcmRoute53';


// Set the region 
AWS.config.update({region: process.env.REGION});
// AWS.config.update({region: 'us-east-1' });

/* The following example creates a resource record set that routes Internet traffic to a resource with an IP address of 192.0.2.44. */
const route53 = new AWS.Route53({apiVersion: '2013-04-01'});

var params = {
    ChangeBatch: {
        Changes: [
            {
                Action: "CREATE", 
                ResourceRecordSet: {
                    AliasTarget: {
                        DNSName: "", 
                        EvaluateTargetHealth: false, 
                        HostedZoneId: ""
                    }, 
                    Name: "", 
                    Type: "A"
                }
            }
        ], 
        Comment: ""
    }, 
    HostedZoneId: "" // Depends on the type of resource that you want to route traffic to
};

export const createRecordSet = runFn(async (name, value, aliasHostedZoneId) => {
    logger.info('----- start create record set -----');
    const hostedZoneId = await listRoute53HostedZones();
    params.ChangeBatch.Changes[0].ResourceRecordSet.Name = name;
    params.ChangeBatch.Changes[0].ResourceRecordSet.AliasTarget.DNSName = value;
    params.ChangeBatch.Changes[0].ResourceRecordSet.AliasTarget.HostedZoneId = aliasHostedZoneId;
    params.HostedZoneId = hostedZoneId;

    const data = await route53.changeResourceRecordSets(params).promise();

    logger.info('----- success create record set -----');
    return data;
});
/*
data = {
ChangeInfo: {
Comment: "Web server for example.com", 
Id: "/change/C2682N5HXP0BZ4", 
Status: "PENDING", 
SubmittedAt: <Date Representation>
}
}
*/