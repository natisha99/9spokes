export function getData(apiName: 'companies-register' | 'google-trends' | 'yahoo-finance') {
  if (apiName == 'companies-register') {
    return {
      "name": "",
      "nzbn": "54321",
      "company_number": "12345",
      "entity_type": "Spicy",
      "incorporated": "",
      "current_status": "Stressed",
      "constitution_filed": "maybe",
      "annual_return_filing_month": "69",
      "ultimate_holding_company": "",
      "company_addresses": {
        "registered_office": "",
        "address_for_service": ""
      },
      "directors": [
        [
          "name0",
          "address0"
        ],
        [
          "name1",
          "address1"
        ],
        [
          "name2",
          "address2"
        ]
      ],
      "shareholdings": {
        "total_nuber_of_shares": 123456,
        "extensive_shareholdings": "Yes/No",
        "shareholders": [
          [
            "name0",
            "address0"
          ],
          [
            "name1",
            "address1"
          ],
          [
            "name2",
            "address2"
          ]
        ]
      }
    }
  }

  if (apiName == 'google-trends') {
    return {
      "graph": [
        [
          "2015-04-26",
          2
        ],
        [
          "2015-04-27",
          3
        ],
        [
          "2015-04-28",
          12
        ],
        [
          "2015-04-29",
          5
        ]
      ]
    }
  }
  
  if (apiName == 'yahoo-finance') {
    return {
      "language":"en-US",
      "region":"US",
      "quoteType":"EQUITY",
      "quoteSourceName":"Delayed Quote",
      "triggerable":true,
      "currency":"USD",
      "tradeable":false,
      "postMarketChangePercent":0.9101887,
      "postMarketTime":1587772799,
      "postMarketPrice":191.8,
      "postMarketChange":1.7299957,
      "regularMarketChange":4.9400024,
      "regularMarketChangePercent":2.6683965,
      "regularMarketTime":1587758402,
      "regularMarketPrice":190.07,
      "regularMarketDayHigh":190.33,
      "regularMarketDayRange":"180.825 - 190.33",
      "regularMarketDayLow":180.825,
      "regularMarketVolume":26666649,
      "regularMarketPreviousClose":185.13,
      "bid":191.75,
      "ask":191.8,
      "bidSize":13,
      "askSize":10,
      "fullExchangeName":"NasdaqGS",
      "financialCurrency":"USD",
      "regularMarketOpen":183.23,
      "averageDailyVolume3Month":23903726,
      "averageDailyVolume10Day":23317587,
      "fiftyTwoWeekLowChange":52.97,
      "fiftyTwoWeekLowChangePercent":0.38636032,
      "fiftyTwoWeekRange":"137.1 - 224.2",
      "fiftyTwoWeekHighChange":-34.12999,
      "fiftyTwoWeekHighChangePercent":-0.15223011,
      "fiftyTwoWeekLow":137.1,
      "fiftyTwoWeekHigh":224.2,
      "exchange":"NMS",
      "shortName":"Facebook, Inc.",
      "longName":"Facebook, Inc.",
      "messageBoardId":"finmb_20765463",
      "exchangeTimezoneName":"America/New_York",
      "exchangeTimezoneShortName":"EDT",
      "gmtOffSetMilliseconds":-14400000,
      "market":"us_market",
      "esgPopulated":false,
      "firstTradeDateMilliseconds":1337347800000,
      "priceHint":2,
      "earningsTimestamp":1588204800,
      "earningsTimestampStart":1588204800,
      "earningsTimestampEnd":1588204800,
      "trailingPE":29.559877,
      "marketState":"CLOSED",
      "epsTrailingTwelveMonths":6.43,
      "epsForward":9.63,
      "sharesOutstanding":2405750016,
      "bookValue":35.433,
      "fiftyDayAverage":166.71286,
      "fiftyDayAverageChange":23.357147,
      "fiftyDayAverageChangePercent":0.14010406,
      "twoHundredDayAverage":192.69992,
      "twoHundredDayAverageChange":-2.6299133,
      "twoHundredDayAverageChangePercent":-0.013647714,
      "marketCap":541847748608,
      "forwardPE":19.73728,
      "priceToBook":5.3642087,
      "sourceInterval":15,
      "exchangeDataDelayedBy":0,
      "symbol":"FB"
    }
  }

  return undefined;
}