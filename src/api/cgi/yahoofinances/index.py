#!/usr/bin/pypy3
from urllib.request import urlopen
import cgi
import mysql.connector
from datetime import datetime, timedelta, date
from threading import Thread
import json

def commit(ticker, iinterval, rrange, results, cursor, cnx):
    sql1 = "DELETE FROM yahoofinances WHERE ticker='{}' AND iinterval='{}' AND rrange='{}';".format(ticker, iinterval, rrange)
    sql2 = "INSERT INTO yahoofinances VALUES('{}', '{}', '{}', '{}', '{}');".format(
        ticker,
        iinterval,
        rrange,
        results,
        str(datetime.now()))
    cursor.execute(sql1)
    cnx.commit()
    cursor.execute(sql2)
    cnx.commit()
    cursor.close()
    cnx.close()

def site(ticker, iinterval, rrange):
    results = urlopen('https://query1.finance.yahoo.com/v8/finance/chart/{}?interval={}&range={}'.format(ticker, iinterval, rrange)).read().decode('utf-8')
    return results

def main():
    form = cgi.FieldStorage()
    try:
        ticker = str(form['ticker_symbol'].value)
        #ticker = 'AIR.NZ'
    except:
        return {'error': 'Invalid parameter'}
    try:
        iinterval = str(form['interval'].value)
    except:
        iinterval = '1d'
    try:
        rrange = str(form['range'].value)
    except:
        rrange = '1y'
    
    # Start sql connector
    cnx = mysql.connector.connect(user='api', database='projectapi')
    cursor = cnx.cursor(buffered=True)
    # Load from database
    sql = "SELECT * FROM yahoofinances WHERE ticker='{}' AND iinterval='{}' AND rrange='{}';".format(ticker, iinterval, rrange)
    cursor.execute(sql)
    try:
        data = list(cursor.fetchall()[0])
        if (datetime.now()-timedelta(days=1)) > data[4]:
            raise IndexError('item in database expired')
        results = data[3]
        cursor.close()
        cnx.close()
    except:  # Not in database or expired
        results = site(ticker, iinterval, rrange)
        # Offload to different thread
        t1 = Thread(target=commit, args=(ticker, iinterval, rrange, results, cursor, cnx,))
        t1.start()
        # If failed to offload, continue on same thread
        #commit(ticker, iinterval, rrange, results, cursor, cnx)
    
    # Beautify
    output = json.loads(results)
    if iinterval == '1d' and rrange == '1y':
        today = datetime.combine(datetime.utcnow().date(), datetime.min.time())-timedelta(hours=12)
        while len(output['chart']['result'][0]['timestamp']) > 250:
            if datetime.utcfromtimestamp(output['chart']['result'][0]['timestamp'][-1]+output['chart']['result'][0]['meta']['gmtoffset']) > today:
                output['chart']['result'][0]['timestamp'].pop()
                output['chart']['result'][0]['indicators']['quote'][0]['low'].pop()
                output['chart']['result'][0]['indicators']['quote'][0]['high'].pop()
                output['chart']['result'][0]['indicators']['quote'][0]['open'].pop()
                output['chart']['result'][0]['indicators']['quote'][0]['close'].pop()
                output['chart']['result'][0]['indicators']['quote'][0]['volume'].pop()
                output['chart']['result'][0]['indicators']['adjclose'][0]['adjclose'].pop()
            else:
                output['chart']['result'][0]['timestamp'].pop(0)
                output['chart']['result'][0]['indicators']['quote'][0]['low'].pop(0)
                output['chart']['result'][0]['indicators']['quote'][0]['high'].pop(0)
                output['chart']['result'][0]['indicators']['quote'][0]['open'].pop(0)
                output['chart']['result'][0]['indicators']['quote'][0]['close'].pop(0)
                output['chart']['result'][0]['indicators']['quote'][0]['volume'].pop(0)
                output['chart']['result'][0]['indicators']['adjclose'][0]['adjclose'].pop(0)
    return json.dumps(output)

if __name__ == '__main__':
    print('Content-type:application/json', end='\r\n\r\n')
    print(main(), end='')

