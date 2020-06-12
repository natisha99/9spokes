#!/usr/bin/python3
import pandas as pd
from pytrends.request import TrendReq
import cgi
import json
import mysql.connector
from datetime import datetime, timedelta
from threading import Thread

def commit(keyword, results, cursor, cnx):
    sql1 = "DELETE FROM googletrends WHERE keyword='{}';".format(keyword)
    sql2 = "INSERT INTO googletrends VALUES('{}', '{}', '{}', '{}');".format(
        keyword,
        'https://trends.google.com/trends/explore?q={}'.format(keyword.replace(' ', '+')),
        str(results),
        str(datetime.now()))
    cursor.execute(sql1)
    cnx.commit()
    cursor.execute(sql2)
    cnx.commit()
    cursor.close()
    cnx.close()

def expected(dump):
    return True

def site(keyword):
    pytrend = TrendReq()
    pytrend.build_payload(kw_list=[keyword])
    df = pytrend.interest_over_time()
    data = df[keyword][::-1]
    dates = [d for d in df.index.astype(str)[::-1]]
    
    results = []
    for i in range(len(data)):
        results.append([str(dates[i]), int(data[i])])
    
    return json.dumps({'series':results})

def main():
    form = cgi.FieldStorage()
    keyword = str(form['keyword'].value)
    try:
        weeks = int(form['weeks'].value)
    except:
        weeks = 52
    
    
    cnx = mysql.connector.connect(user='api', database='projectapi')
    cursor = cnx.cursor(buffered=True)
    
    sql = "SELECT * FROM googletrends WHERE keyword='{}';".format(keyword)
    cursor.execute(sql)
    
    cache_results = ''
    cache_expired = False
    fetch_results = ''
    results = ''
    try:
        data = list(cursor.fetchall()[0])
        if (datetime.now()-timedelta(days=7)) > data[3]:
            raise IndexError('item in database expired')
        cache_results = json.loads(data[2])
        cursor.close()
        cnx.close()
    except:
        cache_expired = True
        fetch_results = site(keyword)
    finally:
        if not cache_expired:
            results = cache_results
        elif expected(fetch_results):
            t1 = Thread(target=commit, args=(keyword, fetch_results, cursor, cnx,))
            t1.start()
            results = fetch_results
        else:
            results = cache_results
    
    results = json.loads(results)
    results['series'] = results['series'][:weeks]
    try:
        factor = 100/max([w[1] for w in results['series']])
        results['series'] = [[x[0],int(x[1]*factor)] for x in results['series']]
    except ZeroDivisionError:
        pass
    return json.dumps(results)

if __name__ == '__main__':
    print('Content-type:application/json', end='\r\n\r\n')
    print(main().encode(encoding='UTF-8',errors='ignore').decode(), end='')
