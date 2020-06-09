#!/usr/bin/pypy3
#!/usr/bin/python3

import mysql.connector
import json
import cgi
from urllib.request import Request, urlopen
from datetime import datetime, timedelta
from threading import Thread

def commit(keyword, result, cursor, cnx):
    # Commit to database
    sql1 = "DELETE FROM nzcompaniesofficesearch WHERE keyword='{}';".format(keyword)
    sql2 = "INSERT INTO nzcompaniesofficesearch VALUES('{}', '{}', '{}');".format(keyword, result, str(datetime.now()))
    cursor.execute(sql1)
    cnx.commit()
    cursor.execute(sql2)
    cnx.commit()
    cursor.close()
    cnx.close()

def worker(html, string, end=True):
    index = html.find(string)
    if index == -1:
        raise Exception('index not found:{}'.format(string))
    return index + (len(string) if end else 0)

def site(keyword):
    url = 'https://app.companiesoffice.govt.nz/companies/app/ui/pages/companies/search?mode=standard&type=entities&q={}&advancedPanel=true&entityTypes=ALL&entityStatusGroups=ALL'.format(keyword).replace(' ', '+')
    #url = 'https://projectapi.co.nz/demosearch.html'
    #url = 'https://app.companiesoffice.govt.nz/companies/app/ui/pages/companies/search?mode=standard&type=entities&q=air&advancedPanel=true&entityTypes=ALL&entityStatusGroups=ALL'
    req = Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    webpage = urlopen(req).read()
    html = webpage.decode('utf-8').replace('\r', '').replace('\n', '')

    # maincol
    panelcontent = html[worker(html, 'class="panelContent"'):]

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
            #keyword = 'test_air'
            #keyword = 'air new'
        except KeyError:
            # For testing outside browser and wrong browser request
            return {'error':'missing parameter'}
    except ValueError:
        # Not a number, stop
        return {'error':'Invalid keyword {}'.format(keyword)}
    cnx = mysql.connector.connect(user='api', database='projectapi')
    cursor = cnx.cursor(buffered=True)
    # Load from database
    sql = "SELECT * FROM nzcompaniesofficesearch WHERE keyword='{}';".format(keyword)
    cursor.execute(sql)
    try:
        data = list(cursor.fetchall()[0])
        if (datetime.now()-timedelta(days=30)) > data[2]:
            raise IndexError('item in database expired')
        result = data[1]
        cursor.close()
        cnx.close()
    except IndexError:  # Not in database or expired
        # Load from companiesregister.py
        result = site(keyword)
        # Add to database
        # Offload to different thread
        t1 = Thread(target=commit, args=(keyword, result, cursor, cnx,))
        t1.start()
        #commit(keyword, result, cursor, cnx)
    
    # Return output
    return(result)
    
if __name__ == "__main__":
    #import time
    #start = time.time()
    print('Content-type:application/json', end='\r\n\r\n')
    print(main(), end='')
    #print(site('9spokes'))
    #print('\r\n\r\n{}s'.format(time.time()-start))
