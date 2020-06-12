#!/usr/bin/pypy3
#!/usr/bin/python3
import cgi
import mysql.connector
from datetime import datetime, timedelta
from threading import Thread
from urllib.request import Request, urlopen
import json

def commit(company_name, results, cursor, cnx):
    sql1 = "DELETE FROM yahoofinancessearch WHERE company_name='{}';".format(company_name)
    sql2 = "INSERT INTO yahoofinancessearch VALUES('{}', '{}', '{}');".format(
        company_name,
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
    
def site(company_name):
    currencies  = ['nzd', 'usd', 'eur', 'aud', 'sgd']
    if company_name in currencies:
        currencies.remove(company_name)
        return json.dumps({'results':[company_name+'/'+c for c in currencies]})
    elif len(company_name) == 7 and company_name[:3] in currencies and company_name[4:] in currencies:
        return json.dumps({'results':[company_name[:3]+'/'+company_name[4:]]})
    else:
        url = 'https://nz.finance.yahoo.com/lookup?s={}'.format(company_name).replace(' ', '%20')
        req = Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        webpage = urlopen(req).read()
        html = webpage.decode('utf-8').replace('\r', '').replace('\n', '')
        
        results = []
        html = html[html.find('Symbols similar to'):]
        
        index = html.find('data-symbol="')
        while index != -1:
            html = html[index+13:]
            end = html.find('"')
            
            results.append(html[:end]) 
            index = html.find('data-symbol="')
        
        output = []
        for result in results:
            if result not in output:
                output.append(result)
        
        return json.dumps({'results':output})
    
def main():
    form = cgi.FieldStorage()
    company_name = str(form['company_name'].value).lower().strip()
    cnx = mysql.connector.connect(user='api', database='projectapi')
    cursor = cnx.cursor(buffered=True)
    sql = "SELECT * FROM yahoofinancessearch WHERE company_name='{}';".format(company_name)
    cursor.execute(sql)
    
    cache_results = ''
    cache_expired = False
    fetch_results = ''
    results = ''
    try:
        data = list(cursor.fetchall()[0])
        if (datetime.now()-timedelta(days=60)) > data[3]:
            raise IndexError('item in database expired')
        cache_results = data[2]
        cursor.close()
        cnx.close()
    except:
        cache_expired = True
        fetch_results = site(company_name)
    finally:
        if not cache_expired:
            results = cache_results
        elif expected(fetch_results):
            t1 = Thread(target=commit, args=(company_name, fetch_results, cursor, cnx,))
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
