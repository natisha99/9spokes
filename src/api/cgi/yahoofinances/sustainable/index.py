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

def expected(dump):
    return True
    
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
    return json.dumps({'results':output})
    
def main():
    form = cgi.FieldStorage()
    ticker_symbol = str(form['ticker_symbol'].value).upper()
    cnx = mysql.connector.connect(user='api', database='projectapi')
    cursor = cnx.cursor(buffered=True)
    sql = "SELECT * FROM yahoofinancessustainable WHERE ticker='{}';".format(ticker_symbol)
    cursor.execute(sql)
    
    cache_results = ''
    cache_expired = False
    fetch_results = ''
    results = ''
    try:
        data = list(cursor.fetchall()[0])
        if (datetime.now()-timedelta(days=30)) > data[2]:
            raise IndexError('item in database expired')
        cache_results = json.loads(data[1])
        cursor.close()
        cnx.close()
    except:
        cache_expired = True
        fetch_results = site(ticker_symbol)
    finally:
        if not cache_expired:
            results = cache_results
        elif expected(fetch_results):
            t1 = Thread(target=commit, args=(ticker_symbol, fetch_results, cursor, cnx,))
            t1.start()
            results = fetch_results
        elif cache_expired:
            results = cache_results
        else:
            results = json.dumps({'error':'api access problem'})

    return results

if __name__ == '__main__':
    print('Content-type:application/json', end='\r\n\r\n')
    print(main().encode(encoding='UTF-8',errors='ignore').decode(), end='')
