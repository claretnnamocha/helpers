import _ from 'lodash';
import fetch from 'node-fetch';
const billerProducts = [
  {
    name: 'MTN Data 1GB (SME)',
    duration: '30 Days',
    amount: 267,
    code: 'M1024',
    network: 'mtn',
    billerId: 'mtn-data',
    group: 'data-bundle',
    hasProducts: true,
    hasValidation: false,
  },
  {
    name: 'MTN Data 2GB (SME)',
    duration: '30 Days',
    amount: 534,
    code: 'M2024',
    network: 'mtn',
    billerId: 'mtn-data',
    group: 'data-bundle',
    hasProducts: true,
    hasValidation: false,
  },
  {
    name: 'MTN Data 3GB (SME)',
    duration: '30 Days',
    amount: 801,
    code: '3000',
    network: 'mtn',
    billerId: 'mtn-data',
    group: 'data-bundle',
    hasProducts: true,
    hasValidation: false,
  },
  {
    name: 'MTN Data 5GB (SME)',
    duration: '30 Days',
    amount: 1335,
    code: '5000',
    network: 'mtn',
    billerId: 'mtn-data',
    group: 'data-bundle',
    hasProducts: true,
    hasValidation: false,
  },
  {
    name: 'MTN Data 8GB (Direct)',
    duration: '30 Days',
    amount: 2579,
    code: 'GIFT8000',
    network: 'mtn',
    billerId: 'mtn-data',
    group: 'data-bundle',
    hasProducts: true,
    hasValidation: false,
  },
  {
    name: 'MTN Data 15GB (Direct)',
    duration: '30 Days',
    amount: 4599,
    code: 'GIFT5000',
    network: 'mtn',
    billerId: 'mtn-data',
    group: 'data-bundle',
    hasProducts: true,
    hasValidation: false,
  },
  {
    name: 'Glo Data 1GB',
    duration: '14 Days',
    amount: 439,
    code: 'G500',
    network: 'glo',
    billerId: 'glo-data',
    group: 'data-bundle',
    hasProducts: true,
    hasValidation: false,
  },
  {
    name: 'Glo Data 2GB/2.5GB',
    duration: '30 Days',
    amount: 869,
    code: 'G1000',
    network: 'glo',
    billerId: 'glo-data',
    group: 'data-bundle',
    hasProducts: true,
    hasValidation: false,
  },
  {
    name: 'Glo Data 5.8GB',
    duration: '30 Days',
    amount: 1749,
    code: 'G2000',
    network: 'glo',
    billerId: 'glo-data',
    group: 'data-bundle',
    hasProducts: true,
    hasValidation: false,
  },
  {
    name: 'Glo Data 7.7GB',
    duration: '30 Days',
    amount: 2159,
    code: 'G2500',
    network: 'glo',
    billerId: 'glo-data',
    group: 'data-bundle',
    hasProducts: true,
    hasValidation: false,
  },
  {
    name: 'Glo Data 10GB',
    duration: '30 Days',
    amount: 2599,
    code: 'G3000',
    network: 'glo',
    billerId: 'glo-data',
    group: 'data-bundle',
    hasProducts: true,
    hasValidation: false,
  },
  {
    name: 'Glo Data 13.25GB',
    duration: '30 Days',
    amount: 3499,
    code: 'G4000',
    network: 'glo',
    billerId: 'glo-data',
    group: 'data-bundle',
    hasProducts: true,
    hasValidation: false,
  },
  {
    name: 'Glo Data 18.25GB',
    duration: '30 Days',
    amount: 4299,
    code: 'G5000',
    network: 'glo',
    billerId: 'glo-data',
    group: 'data-bundle',
    hasProducts: true,
    hasValidation: false,
  },
  {
    name: 'Glo Data 20GB/25GB',
    duration: '30 Days',
    amount: 6899,
    code: 'G8000',
    network: 'glo',
    billerId: 'glo-data',
    group: 'data-bundle',
    hasProducts: true,
    hasValidation: false,
  },
  {
    name: 'Airtel Data 1.5GB',
    duration: '30 Days',
    amount: 929,
    code: 'AIR1000',
    network: 'airtel',
    billerId: 'airtel-data',
    group: 'data-bundle',
    hasProducts: true,
    hasValidation: false,
  },
  {
    name: 'Airtel Data 2GB',
    duration: '30 Days',
    amount: 1049,
    code: 'Air1200',
    network: 'airtel',
    billerId: 'airtel-data',
    group: 'data-bundle',
    hasProducts: true,
    hasValidation: false,
  },
  {
    name: 'Airtel Data 3GB',
    duration: '30 Days',
    amount: 1399,
    code: 'Air1500',
    network: 'airtel',
    billerId: 'airtel-data',
    group: 'data-bundle',
    hasProducts: true,
    hasValidation: false,
  },
  {
    name: 'Airtel Data 4.5GB',
    duration: '30 Days',
    amount: 1869,
    code: 'AIR2000',
    network: 'airtel',
    billerId: 'airtel-data',
    group: 'data-bundle',
    hasProducts: true,
    hasValidation: false,
  },
  {
    name: 'Airtel Data 6GB',
    duration: '30 Days',
    amount: 2349,
    code: 'AIR2500',
    network: 'airtel',
    billerId: 'airtel-data',
    group: 'data-bundle',
    hasProducts: true,
    hasValidation: false,
  },
  {
    name: 'Airtel Data 8GB',
    duration: '30 Days',
    amount: 2799,
    code: 'Air3000',
    network: 'airtel',
    billerId: 'airtel-data',
    group: 'data-bundle',
    hasProducts: true,
    hasValidation: false,
  },
  {
    name: 'Airtel Data 15GB',
    duration: '30 Days',
    amount: 4649,
    code: 'Air5000',
    network: 'airtel',
    billerId: 'airtel-data',
    group: 'data-bundle',
    hasProducts: true,
    hasValidation: false,
  },
  {
    name: 'Airtel Data 40GB',
    duration: '30 Days',
    amount: 9299,
    code: 'Air100000',
    network: 'airte0',
    billerId: 'airtel-data',
    group: 'data-bundle',
    hasProducts: true,
    hasValidation: false,
  },
  {
    name: '9mobile Data 1.5GB',
    duration: '30 Days',
    amount: 879,
    code: '9MOB1000',
    network: '9mobile',
    billerId: '9mobile-data',
    group: 'data-bundle',
    hasProducts: true,
    hasValidation: false,
  },
  {
    name: '9mobile Data 2GB',
    duration: '30 Days',
    amount: 1049,
    code: '9MOB2000',
    network: '9mobile',
    billerId: '9mobile-data',
    group: 'data-bundle',
    hasProducts: true,
    hasValidation: false,
  },
  {
    name: '9mobile Data 3GB',
    duration: '30 Days',
    amount: 1299,
    code: '9MOB3000',
    network: '9mobile',
    billerId: '9mobile-data',
    group: 'data-bundle',
    hasProducts: true,
    hasValidation: false,
  },
  {
    name: '9mobile Data 4.5GB',
    duration: '30 Days',
    amount: 1729,
    code: '9MOB34500',
    network: '9mobile',
    billerId: '9mobile-data',
    group: 'data-bundle',
    hasProducts: true,
    hasValidation: false,
  },
  {
    name: '9mobile Data 11GB',
    duration: '30 Days',
    amount: 3429,
    code: '9MOB4000',
    network: '9mobile',
    billerId: '9mobile-data',
    group: 'data-bundle',
    hasProducts: true,
    hasValidation: false,
  },
  {
    name: '9mobile Data 15GB',
    duration: '30 Days',
    amount: 4279,
    code: '9MOB5000',
    network: '9mobile',
    billerId: '9mobile-data',
    group: 'data-bundle',
    hasProducts: true,
    hasValidation: false,
  },
  {
    name: '9mobile Data 40GB',
    duration: '30 Days',
    amount: 8729,
    code: '9MOB40000',
    network: '9mobile',
    billerId: '9mobile-data',
    group: 'data-bundle',
    hasProducts: true,
    hasValidation: false,
  },
  {
    name: 'DStv Great Wall',
    billerId: 'dstv',
    code: 'dstv-greatwall',
    group: 'cable-tv',
    hasProducts: true,
    hasValidation: true,
  },
  {
    name: 'DStv Padi',
    billerId: 'dstv',
    code: 'dstv-padi',
    group: 'cable-tv',
    hasProducts: true,
    hasValidation: true,
  },
  {
    name: 'DStv Yanga',
    billerId: 'dstv',
    code: 'dstv-yanga',
    group: 'cable-tv',
    hasProducts: true,
    hasValidation: true,
  },
  {
    name: 'DStv Confam',
    billerId: 'dstv',
    code: 'dstv-confam',
    group: 'cable-tv',
    hasProducts: true,
    hasValidation: true,
  },
  {
    name: 'DStv Asian',
    billerId: 'dstv',
    code: 'dstv6',
    group: 'cable-tv',
    hasProducts: true,
    hasValidation: true,
  },
  {
    name: 'DStv Compact',
    billerId: 'dstv',
    code: 'dstv79',
    group: 'cable-tv',
    hasProducts: true,
    hasValidation: true,
  },
  {
    name: 'DStv Compact Plus',
    billerId: 'dstv',
    code: 'dstv7',
    group: 'cable-tv',
    hasProducts: true,
    hasValidation: true,
  },
  {
    name: 'DStv Premium',
    billerId: 'dstv',
    code: 'dstv3',
    group: 'cable-tv',
    hasProducts: true,
    hasValidation: true,
  },
  {
    name: 'DStv Premium Asia',
    billerId: 'dstv',
    code: 'dstv10',
    group: 'cable-tv',
    hasProducts: true,
    hasValidation: true,
  },
  {
    name: 'GOtv Lite',
    billerId: 'gotv',
    code: 'gotv-lite',
    group: 'cable-tv',
    hasProducts: true,
    hasValidation: true,
  },
  {
    name: 'GOtv Jinja',
    billerId: 'gotv',
    code: 'gotv-jinja',
    group: 'cable-tv',
    hasProducts: true,
    hasValidation: true,
  },
  {
    name: 'GOtv Jolli',
    billerId: 'gotv',
    code: 'gotv-jolli',
    group: 'cable-tv',
    hasProducts: true,
    hasValidation: true,
  },
  {
    name: 'GOtv Max',
    billerId: 'gotv',
    code: 'gotv-max',
    group: 'cable-tv',
    hasProducts: true,
    hasValidation: true,
  },
  {
    name: 'Startimes Nova',
    billerId: 'startimes',
    code: 'nova',
    group: 'cable-tv',
    hasProducts: true,
    hasValidation: true,
  },
  {
    name: 'Startimes Basic',
    billerId: 'startimes',
    code: 'basic',
    group: 'cable-tv',
    hasProducts: true,
    hasValidation: true,
  },
  {
    name: 'Startimes Smart',
    billerId: 'startimes',
    code: 'smart',
    group: 'cable-tv',
    hasProducts: true,
    hasValidation: true,
  },
  {
    name: 'Startimes Classic',
    billerId: 'startimes',
    code: 'classic',
    group: 'cable-tv',
    hasProducts: true,
    hasValidation: true,
  },
  {
    name: 'Startimes Super',
    billerId: 'startimes',
    code: 'super',
    group: 'cable-tv',
    hasProducts: true,
    hasValidation: true,
  },
];

export const electricityBillers = [
  {
    billerId: 'abuja-electric',
    group: 'electricity',
    name: 'Abuja Electricity Distribution Company (AEDC)',
    hasProducts: false,
    hasValidation: true,
  },
  {
    billerId: 'eko-electric',
    group: 'electricity',
    name: 'Eko Electricity Distribution Company (EKEDC)',
    hasProducts: false,
    hasValidation: true,
  },
  {
    billerId: 'ibadan-electric',
    group: 'electricity',
    name: 'Ibadan Electricity Distribution Company (IBEDC)',
    hasProducts: false,
    hasValidation: true,
  },
  {
    billerId: 'ikeja-electric',
    group: 'electricity',
    name: 'Ikeja Electricity Distribution Company (IKEDC)',
    hasProducts: false,
    hasValidation: true,
  },
  {
    billerId: 'jos-electric',
    group: 'electricity',
    name: 'Jos Electricity Distribution PLC (JEDplc)',
    hasProducts: false,
    hasValidation: true,
  },
  {
    billerId: 'kaduna-electric',
    group: 'electricity',
    name: 'Kaduna Electricity Distribution Company (KAEDCO)',
    hasProducts: false,
    hasValidation: true,
  },
  {
    billerId: 'kano-electric',
    group: 'electricity',
    name: 'Kano Electricity Distribution Company (KEDCO)',
    hasProducts: false,
    hasValidation: true,
  },
  {
    billerId: 'portharcourt-electric',
    group: 'electricity',
    name: 'Port Harcourt Electricity Distribution Company (PHED)',
    hasProducts: false,
    hasValidation: true,
  },
];

const request = async ({url, body = {}}) => {
  const {PAYGOLD_USERNAME, PAYGOLD_PASSWORD} = process.env;

  try {
    body = {...body, username: PAYGOLD_USERNAME, password: PAYGOLD_PASSWORD};
    const searchParams = new URLSearchParams(body);
    searchParams.toString();
    let response: any = await fetch(
        `https://paygold.ng/wp-json/api/v1/${url}?${searchParams.toString()}`,
    );

    response = await response.json();

    response.status = response.code === 'success';
    delete response.code;
    return response;
  } catch (error) {
    return {
      status: false,
      message: 'An error occured calling paygold',
    };
  }
};

export const getAccountBalance = async () => await request({url: 'balance'});

export const getCategories = async () => [
  {
    id: 'cable-tv',
    name: 'CableTV',
  },
  {
    id: 'electricity',
    name: 'Electricity',
  },
  {
    id: 'airtime',
    name: 'Airtime',
  },
  {
    id: 'data-bundle',
    name: 'Data Bundle',
  },
];

export const getBillersInCategory = ({id}) => {
  switch (id) {
    case 'electricity':
      return electricityBillers;
    case 'airtime':
      return [
        {
          group: 'airtime',
          name: 'MTN',
          billerId: 'mtn',
          hasProducts: false,
          hasValidation: false,
        },
        {
          group: 'airtime',
          name: 'Glo',
          billerId: 'glo',
          hasProducts: false,
          hasValidation: false,
        },
        {
          group: 'airtime',
          name: '9Mobile',
          billerId: '9mobile',
          hasProducts: false,
          hasValidation: false,
        },
        {
          group: 'airtime',
          name: 'Airtel',
          billerId: 'airtel',
          hasProducts: false,
          hasValidation: false,
        },
      ];
    default:
      return _.uniqBy(
          Object.values(
              _.groupBy(
                  billerProducts.filter((b) => b.group === id),
                  (plan) => plan.billerId,
              ),
          )
              .flat(1)
              .map(({billerId, network, hasProducts, hasValidation}: any) => {
                return {
                  billerId,
                  name: network || billerId,
                  hasProducts,
                  hasValidation,
                };
              }),
          (g) => g.billerId,
      );
  }
};

export const getBillerItems = ({billerId}) => {
  const d = _.groupBy(billerProducts, (plan) => plan.billerId)[billerId];

  if (!d) return [];

  return d;
};

export const verifyCustomer = async ({
  customerId: customer_id,
  serviceId: service_id,
  variationId: variation_id = null,
}) => {
  return request({
    url: 'verify-customer',
    body: {customer_id, service_id, variation_id},
  });
};

export const payBill = async ({
  customerId: customer_id,
  phone,
  serviceId: service_id = null,
  productId: product_id = null,
  group,
  amount,
}) => {
  let response: any;

  switch (group) {
    case 'airtime':
      response = await request({
        url: 'airtime',
        body: {network_id: service_id, phone: customer_id, amount},
      });
      break;
    case 'electricity':
      response = await request({
        url: 'electricity',
        body: {
          service_id,
          variation_id: product_id,
          phone,
          amount,
          meter_number: customer_id,
        },
      });
      break;
    case 'data-bundle':
      response = await request({
        url: 'data',
        body: {
          phone: customer_id,
          netword_id: service_id,
          variation_id: product_id,
        },
      });
      break;
    case 'cable-tv':
      response = await request({
        url: 'tv',
        body: {
          phone,
          service_id,
          smartcard_number: customer_id,
          variation_id: product_id,
        },
      });
      break;
  }

  return {status: response.status, message: response.message};
};

export const getPayableAmount = ({amount, group, productId}) =>
  ['data-bundle', 'cable-tv'].includes(group) ?
    _.groupBy(billerProducts, (p) => p.code)[productId][0].amount :
    amount;
