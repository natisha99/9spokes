#!/usr/bin/pypy3
#!/usr/bin/python3

import mysql.connector
import json
import cgi
from urllib.request import Request, urlopen
from datetime import datetime, timedelta
from threading import Thread

def commit(keyword, result, cursor, cnx):
    sql1 = "DELETE FROM nzcompaniesofficesearch WHERE keyword='{}';".format(keyword)
    sql2 = "INSERT INTO nzcompaniesofficesearch VALUES('{}', '{}', '{}');".format(keyword, result, str(datetime.now()))
    cursor.execute(sql1)
    cnx.commit()
    cursor.execute(sql2)
    cnx.commit()
    cursor.close()
    cnx.close()

def expected(dump):
    return True

def worker(html, string, end=True):
    index = html.find(string)
    if index == -1:
        raise Exception('index not found:{}'.format(string))
    return index + (len(string) if end else 0)

def site(keyword):
    url = 'https://app.companiesoffice.govt.nz/companies/app/ui/pages/companies/search?mode=standard&type=entities&q={}&advancedPanel=true&entityTypes=ALL&entityStatusGroups=ALL'.format(keyword).replace(' ', '+')
    req = Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    webpage = urlopen(req).read()
    html = webpage.decode('utf-8').replace('\r', '').replace('\n', '')

    # maincol
    try:
        panelcontent = html[worker(html, 'class="panelContent"'):]
    except: # If site is down
        return json.dumps([])

    results = []
    while True:
        try:
            panelcontent = panelcontent[worker(panelcontent, 'class="entityName">'):]
            _name = panelcontent[:worker(panelcontent, '</span>', end=False):]

            panelcontent = panelcontent[worker(panelcontent, 'class="entityInfo">'):]
            _company_number = panelcontent[worker(panelcontent, '('):]
            _company_number = int(_company_number[:worker(_company_number, ')', end=False):])
            
            try:
                _rest = panelcontent[:worker(panelcontent, '"')]
                if 'Removed' not in _rest:
                    results.append([_name, _company_number])
            except:
                results.append([_name, _company_number])
        except:
            break
    
    return json.dumps(results)

def main():
    form = cgi.FieldStorage()
    try:
        try:
            keyword = str(form['keyword'].value).lower()
        except KeyError:
            return {'error':'missing parameter'}
    except ValueError:
        return {'error':'Invalid keyword {}'.format(keyword)}
    cnx = mysql.connector.connect(user='api', database='projectapi')
    cursor = cnx.cursor(buffered=True)
    
    sql = "SELECT * FROM nzcompaniesofficesearch WHERE keyword='{}';".format(keyword)
    cursor.execute(sql)
    
    cache_results = ''
    cache_expired = False
    fetch_results = ''
    results = ''
    try:
        data = list(cursor.fetchall()[0])
        if (datetime.now()-timedelta(days=30)) > data[2]:
            raise IndexError('item in database expired')
        cache_results = data[1]
        cursor.close()
        cnx.close()
    except IndexError:
        cache_expired =  True
        fetch_results = site(keyword)
    finally:
        if not cache_expired:
            results = cache_results
        elif expected(fetch_results):
            t1 = Thread(target=commit, args=(keyword, fetch_results, cursor, cnx,))
            t1.start()
            results = fetch_results
        elif cache_expired:
            results = cache_results
        else:
            results = json.dumps({'error':'api access problem'})
    return results
    
if __name__ == "__main__":
    print('Content-type:application/json', end='\r\n\r\n')
    print(main().encode(encoding='UTF-8',errors='ignore').decode(), end='')
