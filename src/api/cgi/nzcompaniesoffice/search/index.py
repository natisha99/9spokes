#!/usr/bin/pypy3
#!/usr/bin/python3

import mysql.connector
import json
import cgi
from urllib.request import Request, urlopen
from datetime import datetime, timedelta
from threading import Thread

def commit(keyword, result, cursor, cnx):
    """
        The commit function adds the results to the mysql database cache.
 
    """

    # Two sql quries to remove the result if it has expired and add the new result to the database cache.
    sql1 = "DELETE FROM nzcompaniesofficesearch WHERE keyword='{}';".format(keyword)
    # This table uses a single column primary key keyword(s).
    sql2 = "INSERT INTO nzcompaniesofficesearch VALUES('{}', '{}', '{}');".format(keyword, result, str(datetime.now()))
    cursor.execute(sql1)
    cnx.commit()        # Commiting the delete query before executing insert query.
    cursor.execute(sql2)
    cnx.commit()
    cursor.close()
    cnx.close()         # Close database connection.

def worker(html, string, end=True):
    """
        Worker thread locates substring of string location.
        
        Intended to be multithreaded but was ultimately deemed unnessasary due to fast execution speed .find() function.
        O(log n), avg processing time: 4 miliseconds
    """
    index = html.find(string)
    if index == -1:
        raise Exception('index not found:{}'.format(string))
    return index + (len(string) if end else 0)

def site(keyword):
    """
        Self created search companies office nz api.
        The official companies office nz api is very limited and provides us with no useful data.

        So this function searches for companies retrieves their appropriate names and numbers.
    """

    # Load company profile web page on companies office nz.
    url = 'https://app.companiesoffice.govt.nz/companies/app/ui/pages/companies/search?mode=standard&type=entities&q={}&advancedPanel=true&entityTypes=ALL&entityStatusGroups=ALL'.format(keyword).replace(' ', '+')
    req = Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    webpage = urlopen(req).read()
    html = webpage.decode('utf-8').replace('\r', '').replace('\n', '')  # Removes all new line characters to reduce memory search footprint.

    # Extracts the maincol from the source
    panelcontent = html[worker(html, 'class="panelContent"'):]

    results = []
    while True:
        try:
            panelcontent = panelcontent[worker(panelcontent, 'class="entityName">'):]
            _name = panelcontent[:worker(panelcontent, '</span>', end=False):]

            panelcontent = panelcontent[worker(panelcontent, 'class="entityInfo">'):]
            _company_number = panelcontent[worker(panelcontent, '('):]
            _company_number = int(_company_number[:worker(_company_number, ')', end=False):])
            
            results.append([_name, _company_number])
        except:
            break
    
    return json.dumps(results)

def main():
    """
        Executes apropriate functions to retrieve and return search results from companies house.
    """

    # Retrieve html GET and POST request.
    form = cgi.FieldStorage()
    try:
        try:
            # Extract company_number from request.
            keyword = str(form['keyword'].value).lower()
        except KeyError:
            return {'error':'missing parameter'}
    except ValueError:
        # Not a number, stop
        return {'error':'Invalid keyword {}'.format(keyword)}

    # Connects to local database cache
    cnx = mysql.connector.connect(user='api', database='projectapi')
    cursor = cnx.cursor(buffered=True)
    
    # Load results from database cache.
    sql = "SELECT * FROM nzcompaniesofficesearch WHERE keyword='{}';".format(keyword)
    cursor.execute(sql)
    try:
        """
                If in database cache return the result to the client.    
        """
        data = list(cursor.fetchall()[0])
        if (datetime.now()-timedelta(days=30)) > data[2]:
            raise IndexError('item in database expired')
        result = data[1]
        cursor.close()
        cnx.close()
    except IndexError:
        """
                If not in database cache or expired get new result from yahoofiances api.    
        """
        
        result = site(keyword)

        # Offload adding to database on different thread to return results without delay.
        t1 = Thread(target=commit, args=(keyword, result, cursor, cnx,))
        t1.start()
    
    # Return output
    return(result)
    
if __name__ == "__main__":
    """
        If main thread execute program.
    """
    print('Content-type:application/json', end='\r\n\r\n')  # Informs the client (recipient/browser) of datatype json.
    print(main(), end='')                                   # Executes main function and pass to client.
