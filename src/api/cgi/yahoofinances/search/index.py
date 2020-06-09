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

def site(company_name):
    url = 'https://nz.finance.yahoo.com/lookup?s={}'.format(company_name).replace(' ', '%20')
    #url = 'https://nz.finance.yahoo.com/lookup?s=air%20new%20zealand'
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
    company_name = str(form['company_name'].value).lower()
    
    #company_name = 'air new zealand'
    
    # Start sql connector
    cnx = mysql.connector.connect(user='api', database='projectapi')
    cursor = cnx.cursor(buffered=True)
    # Load from database
    sql = "SELECT * FROM yahoofinancessearch WHERE company_name='{}';".format(company_name)
    cursor.execute(sql)
    try:
        data = list(cursor.fetchall()[0])
        if (datetime.now()-timedelta(days=60)) > data[3]:
            raise IndexError('item in database expired')
        results = data[2]
        cursor.close()
        cnx.close()
        #print('database')
    except:  # Not in database or expired
        results = site(company_name)
        # Offload to different thread
        t1 = Thread(target=commit, args=(company_name, results, cursor, cnx,))
        t1.start()
        #print('google api')
        # If failed to offload, continue on same thread
        #commit(company_name, json.dumps(results), cursor, cnx)

    return results

if __name__ == '__main__':
    print('Content-type:application/json', end='\r\n\r\n')
    print(main(), end='')
