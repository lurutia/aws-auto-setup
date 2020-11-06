import 'dotenv-safe/config';
import runFn from '../utils/runFn';
import AWS from 'aws-sdk';
import * as uuid from 'uuid';
import logger from '../utils/loggers';

AWS.config.update({region: "us-east-1"})

var cloudfront = new AWS.CloudFront({apiVersion: '2020-05-31'});
var acm = new AWS.ACM({apiVersion: '2015-12-08'});


var params = {
    DistributionConfig: { /* required */
      CallerReference: uuid.v4(), /* required */
      Comment: process.env.PROJECT_NAME+' cloud front', /* required */
      DefaultCacheBehavior: { /* required */
        TargetOriginId: 'S3'+'-'+process.env.PROJECT_NAME+'-frontend', /* required */
        ViewerProtocolPolicy: 'redirect-to-https', /* required */
        AllowedMethods: {
          Items: [ /* required */
            'GET',
            'HEAD',
            /* more items */
          ],
          Quantity: 2, /* required */
          CachedMethods: {
            Items: [ /* required */
              'GET',
              'HEAD',
              /* more items */
            ],
            Quantity: 2 /* required */
          }
        },
        // CachePolicyId: 'Managed-CachingOptimized',
        Compress: true,
        // DefaultTTL: 'NUMBER_VALUE',
        // FieldLevelEncryptionId: 'STRING_VALUE',
        ForwardedValues: {
          Cookies: { /* required */
            Forward: 'none', /* required */
            // WhitelistedNames: {
            //   Quantity: 'NUMBER_VALUE', /* required */
            //   Items: [
            //     'STRING_VALUE',
            //     /* more items */
            //   ]
            // }
          },
          QueryString: false, /* required */
        //   Headers: {
        //     Quantity: 'NUMBER_VALUE', /* required */
        //     Items: [
        //       'STRING_VALUE',
        //       /* more items */
        //     ]
        //   },
        //   QueryStringCacheKeys: {
        //     Quantity: 'NUMBER_VALUE', /* required */
        //     Items: [
        //       'STRING_VALUE',
        //       /* more items */
        //     ]
        //   }
        },
        // LambdaFunctionAssociations: {
        //   Quantity: 'NUMBER_VALUE', /* required */
        //   Items: [
        //     {
        //       EventType: viewer-request | viewer-response | origin-request | origin-response, /* required */
        //       LambdaFunctionARN: 'STRING_VALUE', /* required */
        //       IncludeBody: true || false
        //     },
        //     /* more items */
        //   ]
        // },
        // MaxTTL: 'NUMBER_VALUE',
        MinTTL: 0,
        // OriginRequestPolicyId: 'STRING_VALUE',
        // RealtimeLogConfigArn: 'STRING_VALUE',
        // SmoothStreaming: true || false,
        // TrustedKeyGroups: {
        //   Enabled: true || false, /* required */
        //   Quantity: 'NUMBER_VALUE', /* required */
        //   Items: [
        //     'STRING_VALUE',
        //     /* more items */
        //   ]
        // },
        TrustedSigners: {
          Enabled: false, /* required */
          Quantity: 0, /* required */
          Items: []
        }
      },
      Enabled: true, /* required */
      Origins: { /* required */
        Items: [ /* required */
          {
            DomainName: process.env.PROJECT_NAME+'-frontend.s3.amazonaws.com', /* required */
            Id: 'S3-'+process.env.PROJECT_NAME+'-frontend', /* required */
            // ConnectionAttempts: 'NUMBER_VALUE',
            // ConnectionTimeout: 'NUMBER_VALUE',
            // CustomHeaders: {
            //   Quantity: 'NUMBER_VALUE', /* required */
            //   Items: [
            //     {
            //       HeaderName: 'STRING_VALUE', /* required */
            //       HeaderValue: 'STRING_VALUE' /* required */
            //     },
            //     /* more items */
            //   ]
            // },
            // CustomOriginConfig: {
            //   HTTPPort: 'NUMBER_VALUE', /* required */
            //   HTTPSPort: 'NUMBER_VALUE', /* required */
            //   OriginProtocolPolicy: http-only | match-viewer | https-only, /* required */
            //   OriginKeepaliveTimeout: 'NUMBER_VALUE',
            //   OriginReadTimeout: 'NUMBER_VALUE',
            //   OriginSslProtocols: {
            //     Items: [ /* required */
            //       SSLv3 | TLSv1 | TLSv1.1 | TLSv1.2,
            //       /* more items */
            //     ],
            //     Quantity: 'NUMBER_VALUE' /* required */
            //   }
            // },
            // OriginPath: 'STRING_VALUE',
            // OriginShield: {
            //   Enabled: true || false, /* required */
            //   OriginShieldRegion: 'STRING_VALUE'
            // },
            S3OriginConfig: {
              OriginAccessIdentity: '' /* required */
            }
          },
          /* more items */
        ],
        Quantity: 1 /* required */
      },
      Aliases: {
        Quantity: 2, /* required */
        Items: [
          'www.'+process.env.PROJECT_NAME+process.env.DNS,
          process.env.PROJECT_NAME+process.env.DNS,
        ]
      },
    //   CacheBehaviors: {
    //     Quantity: 'NUMBER_VALUE', /* required */
    //     Items: [
    //       {
    //         PathPattern: 'STRING_VALUE', /* required */
    //         TargetOriginId: 'STRING_VALUE', /* required */
    //         ViewerProtocolPolicy: allow-all | https-only | redirect-to-https, /* required */
    //         AllowedMethods: {
    //           Items: [ /* required */
    //             GET | HEAD | POST | PUT | PATCH | OPTIONS | DELETE,
    //             /* more items */
    //           ],
    //           Quantity: 'NUMBER_VALUE', /* required */
    //           CachedMethods: {
    //             Items: [ /* required */
    //               GET | HEAD | POST | PUT | PATCH | OPTIONS | DELETE,
    //               /* more items */
    //             ],
    //             Quantity: 'NUMBER_VALUE' /* required */
    //           }
    //         },
    //         CachePolicyId: 'STRING_VALUE',
            // Compress: true,
    //         DefaultTTL: 'NUMBER_VALUE',
    //         FieldLevelEncryptionId: 'STRING_VALUE',
    //         ForwardedValues: {
    //           Cookies: { /* required */
    //             Forward: none | whitelist | all, /* required */
    //             WhitelistedNames: {
    //               Quantity: 'NUMBER_VALUE', /* required */
    //               Items: [
    //                 'STRING_VALUE',
    //                 /* more items */
    //               ]
    //             }
    //           },
    //           QueryString: true || false, /* required */
    //           Headers: {
    //             Quantity: 'NUMBER_VALUE', /* required */
    //             Items: [
    //               'STRING_VALUE',
    //               /* more items */
    //             ]
    //           },
    //           QueryStringCacheKeys: {
    //             Quantity: 'NUMBER_VALUE', /* required */
    //             Items: [
    //               'STRING_VALUE',
    //               /* more items */
    //             ]
    //           }
    //         },
    //         LambdaFunctionAssociations: {
    //           Quantity: 'NUMBER_VALUE', /* required */
    //           Items: [
    //             {
    //               EventType: viewer-request | viewer-response | origin-request | origin-response, /* required */
    //               LambdaFunctionARN: 'STRING_VALUE', /* required */
    //               IncludeBody: true || false
    //             },
    //             /* more items */
    //           ]
    //         },
    //         MaxTTL: 'NUMBER_VALUE',
    //         MinTTL: 'NUMBER_VALUE',
    //         OriginRequestPolicyId: 'STRING_VALUE',
    //         RealtimeLogConfigArn: 'STRING_VALUE',
    //         SmoothStreaming: true || false,
    //         TrustedKeyGroups: {
    //           Enabled: true || false, /* required */
    //           Quantity: 'NUMBER_VALUE', /* required */
    //           Items: [
    //             'STRING_VALUE',
    //             /* more items */
    //           ]
    //         },
    //         TrustedSigners: {
    //           Enabled: true || false, /* required */
    //           Quantity: 'NUMBER_VALUE', /* required */
    //           Items: [
    //             'STRING_VALUE',
    //             /* more items */
    //           ]
    //         }
    //       },
    //       /* more items */
    //     ]
    //   },
      CustomErrorResponses: {
        Quantity: 1, /* required */
        Items: [
          {
            ErrorCode: 403, /* required */
            ErrorCachingMinTTL: 10,
            ResponseCode: '200',
            ResponsePagePath: '/index.html'
          },
          /* more items */
        ]
      },
      DefaultRootObject: 'index.html',
      HttpVersion: 'http2',
      IsIPV6Enabled: true,
    //   Logging: {
    //     Bucket: 'STRING_VALUE', /* required */
    //     Enabled: true || false, /* required */
    //     IncludeCookies: true || false, /* required */
    //     Prefix: 'STRING_VALUE' /* required */
    //   },
    //   OriginGroups: {
    //     Quantity: 'NUMBER_VALUE', /* required */
    //     Items: [
    //       {
    //         FailoverCriteria: { /* required */
    //           StatusCodes: { /* required */
    //             Items: [ /* required */
    //               'NUMBER_VALUE',
    //               /* more items */
    //             ],
    //             Quantity: 'NUMBER_VALUE' /* required */
    //           }
    //         },
    //         Id: 'STRING_VALUE', /* required */
    //         Members: { /* required */
    //           Items: [ /* required */
    //             {
    //               OriginId: 'STRING_VALUE' /* required */
    //             },
    //             /* more items */
    //           ],
    //           Quantity: 'NUMBER_VALUE' /* required */
    //         }
    //       },
    //       /* more items */
    //     ]
    //   },
      PriceClass: 'PriceClass_All',
    //   Restrictions: {
    //     GeoRestriction: { /* required */
    //       Quantity: 'NUMBER_VALUE', /* required */
    //       RestrictionType: blacklist | whitelist | none, /* required */
    //       Items: [
    //         'STRING_VALUE',
    //         /* more items */
    //       ]
    //     }
    //   },
      ViewerCertificate: {
        ACMCertificateArn: '',
        // Certificate: 'example.com',
        // CertificateSource: 'acm',
        CloudFrontDefaultCertificate: false,
        // IAMCertificateId: '3988dbaf-1ab4-4443-a348-c78c1ea0cc2e',
        MinimumProtocolVersion: 'TLSv1.2_2019',
        SSLSupportMethod: 'sni-only'
      },
    //   WebACLId: 'STRING_VALUE'
    }
};


/* cloudFront 생성 */
export const createDistribution = runFn(async () => {
  logger.info('----- start CloudFront create distribution -----');

  /* 활성화 된 certificate 목록 불러오기 */
  const certificateList = await listCertificates("ISSUED");

  /* 도메인명과 일치하는 acm 찾기 */
  var finder = certificateList.CertificateSummaryList.find(certificate => {
      return certificate.DomainName === process.env.PROJECT_NAME+process.env.DNS;
  });

  // logger.info(finder);

  /* distribution 설정값에 acm arn 적용 */
  params.DistributionConfig.ViewerCertificate.ACMCertificateArn = finder.CertificateArn;
  
  /* distribution 생성 */
  const data = await cloudfront.createDistribution(params).promise();

  logger.info('----- success CloudFront create distribution -----');
  return data;
});

// createDistribution();