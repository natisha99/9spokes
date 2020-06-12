#!/usr/bin/pypy3
#!/usr/bin/python3

from http.client import HTTPSConnection
from base64 import b64encode
import json
import mysql.connector
from datetime import datetime, timedelta
from threading import Thread
import cgi


class ukcompanieshouse:
    URL = 'api.companieshouse.gov.uk'
    KEY = 'qIBRmqZAEJFQrpaoYPKs-2b3XkdchKOOy4GufDaS'
    
    def __init__(self):
        basic_auth = b64encode((self.KEY+':').encode(encoding='ascii', errors='ignore')).decode("ascii")
        self.headers = {'Authorization' : 'Basic {}'.format(basic_auth)}

    def api(self, req):
        c = HTTPSConnection(self.URL)
        c.request('GET', req, headers=self.headers)
        return c.getresponse().read().decode('utf-8', errors='ignore')
    
    def search(self, keyword):
        res = self.api('/search/companies?q={}&items_per_page=10'.format(keyword.replace(' ', '%20')))
        results = [[company['title'],company['company_number']] for company in json.loads(res)['items']]
        return results

    def filing_history(self, company_number):
        res = self.api('/company/{}/filing-history'.format(company_number))
        results = json.loads(res)
        if 'items' in results:
            return results['items']
        else:
            return {}

    def officers(self, company_number):
        res = self.api('/company/{}/officers'.format(company_number))
        results = json.loads(res)
        if 'items' in results:
            return results['items']
        else:
            return {}

    def persons_with_significant_control(self, company_number):
        res = self.api('/company/{}/persons-with-significant-control'.format(company_number))
        results = json.loads(res)
        if 'items' in results:
            return results['items']
        else:
            return {}

    def exemptions(self, company_number):
        res = self.api('/company/{}/exemptions'.format(company_number))
        results = json.loads(res)
        if 'exemptions' in results:
            return results['exemptions']
        else:
            return {}

    def registers(self, company_number):
        res = self.api('/company/{}/registers'.format(company_number))
        results = json.loads(res)
        if 'error' in results:
            return {}
        else:
            return results
    
    def company_profile(self, company_number, recursive=True):
        res = self.api('/company/{}'.format(company_number))
        results = json.loads(res)
        for r in results:
            if results[r] == False:
                results[r] = 'No'
            elif results[r] == True:
                results[r] = 'Yes'
        if recursive:
            results['links']['filing_history'] = self.filing_history(company_number)
            results['links']['officers'] = self.officers(company_number)
            results['links']['persons_with_significant_control'] = self.persons_with_significant_control(company_number)
            results['links']['exemptions'] = self.exemptions(company_number)
            results['links']['registers'] = self.registers(company_number)
        results['date_retrieved'] = str(datetime.now().date())
        results['url'] = 'https://beta.companieshouse.gov.uk'+results['links']['self']
        return {'results': results}

def commit(company_number, results, cursor, cnx):
    sql1 = "DELETE FROM ukcompanieshouse WHERE company_number=%s;"
    sql2 = "INSERT INTO ukcompanieshouse VALUES(%s, %s, %s);"
    val = (
        company_number,
        results,
        str(datetime.now()))
    cursor.execute(sql1, (company_number,))
    cnx.commit()
    cursor.execute(sql2, val)
    cnx.commit()
    cursor.close()
    cnx.close()

def expected(dump):
    return True
    
def main():
    form = cgi.FieldStorage()
    company_number = str(form['company_number'].value)

    cnx = mysql.connector.connect(user='api', database='projectapi')
    cursor = cnx.cursor(buffered=True)
    
    sql = "SELECT * FROM ukcompanieshouse WHERE company_number=%s;"
    cursor.execute(sql, (company_number,))
    
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
    except:
        cache_expired = True
        company = ukcompanieshouse()
        fetch_results = json.dumps(company.company_profile(company_number))
    finally:
        if not cache_expired:
            results = cache_results
        elif expected(fetch_results):
            t1 = Thread(target=commit, args=(company_number, fetch_results, cursor, cnx,))
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
