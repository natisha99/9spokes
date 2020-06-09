#!/usr/bin/python3
import cgi
import mysql.connector
from datetime import datetime, timedelta
from threading import Thread
import json
import yfinance as yf

def commit(ticker_symbol, results, cursor, cnx):
    sql1 = "DELETE FROM yahoofinancessustainable WHERE ticker='{}';".format(ticker_symbol)
    sql2 = "INSERT INTO yahoofinancessustainable VALUES('{}', '{}', '{}');".format(
        ticker_symbol,
        results,
        str(datetime.now()))
    cursor.execute(sql1)
    cnx.commit()
    cursor.execute(sql2)
    cnx.commit()
    cursor.close()
    cnx.close()

def site(ticker_symbol):
    stock = yf.Ticker(ticker_symbol)
    sus = stock.sustainability
    try:
        c1 = list(sus.index.values)
        c2 = list(sus['Value'].values)
        output = {}
        for i in range(len(c1)):
            output[c1[i]] = c2[i]
    except:
        output = {'gmo': 'Not Available', 'coal': 'Not Available', 'adult': 'Not Available', 'nuclear': 'Not Available', 'palmOil': 'Not Available', 'tobacco': 'Not Available', 'catholic': 'Not Available', 'gambling': 'Not Available', 'totalEsg': 'Not Available', 'alcoholic': 'Not Available', 'peerCount': 'Not Available', 'peerGroup': 'Not Available', 'smallArms': 'Not Available', 'furLeather': 'Not Available', 'percentile': 'Not Available', 'pesticides': 'Not Available', 'socialScore': 'Not Available', 'animalTesting': 'Not Available', 'esgPerformance': 'Not Available', 'governanceScore': 'Not Available', 'environmentScore': 'Not Available', 'militaryContract': 'Not Available', 'socialPercentile': 'Not Available', 'highestControversy': 'Not Available', 'controversialWeapons': 'Not Available', 'governancePercentile': 'Not Available', 'environmentPercentile': 'Not Available'}
    return {'results':output}
    
def main():
    form = cgi.FieldStorage()
    ticker_symbol = str(form['ticker_symbol'].value).upper()
    #company_name = 'Air New Zealand Limited'
    #ticker_symbol = 'fb'
    #ticker_symbol = 'AIR.NZ'
    # Start sql connector
    cnx = mysql.connector.connect(user='api', database='projectapi')
    cursor = cnx.cursor(buffered=True)
    # Load from database
    sql = "SELECT * FROM yahoofinancessustainable WHERE ticker='{}';".format(ticker_symbol)
    cursor.execute(sql)
    try:
        data = list(cursor.fetchall()[0])
        if (datetime.now()-timedelta(days=30)) > data[2]:
            raise IndexError('item in database expired')
        results = json.loads(data[1])
        cursor.close()
        cnx.close()
        #print('database')
    except:  # Not in database or expired
        results = json.dumps(site(ticker_symbol))
        # Offload to different thread
        t1 = Thread(target=commit, args=(ticker_symbol, results, cursor, cnx,))
        t1.start()
        #print('google api')
        # If failed to offload, continue on same thread
        #commit(company_name, json.dumps(results), cursor, cnx)

    return results

if __name__ == '__main__':
    print('Content-type:application/json', end='\r\n\r\n')
    print(main(), end='')
