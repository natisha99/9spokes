#!/usr/bin/pypy3
#!/usr/bin/python3

import cgi
import mysql.connector
from urllib.request import urlopen
from datetime import datetime, timedelta
from threading import Thread

def commit(ticker, iinterval, rrange, results, cursor, cnx):
    """
        The commit function adds the results to the mysql database cache.
 
    """

    # Two sql quries to remove the result if it has expired and add the new result to the database cache.
    sql1 = "DELETE FROM yahoofinances WHERE ticker='{}' AND iinterval='{}' AND rrange='{}';".format(ticker, iinterval, rrange)
    # This table uses a multiple column primary key consisting of {ticker, iinterval, rrange}
    sql2 = "INSERT INTO yahoofinances VALUES('{}', '{}', '{}', '{}', '{}');".format(
        ticker,
        iinterval,      # iinterval is spelled with 2 i's because interval is reserved by mysql.
        rrange,         # rrange is spelled with 2 r's because range is reserved by python.
        results,
        str(datetime.now()))
    cursor.execute(sql1)
    cnx.commit()        # Commiting the delete query before executing insert query.
    cursor.execute(sql2)
    cnx.commit()
    cursor.close()
    cnx.close()         # Close database connection.

def site(ticker, iinterval, rrange):
    """
        Retrieves and decode the result from yahoo finance api.
    """
    results = urlopen('https://query1.finance.yahoo.com/v8/finance/chart/{}?interval={}&range={}'.format(ticker, iinterval, rrange)).read().decode('utf-8')
    return results

def main():
    """
        Main function executes client request by returning appropriate json results from either the local cache or remote api.
    """

    # Retrieve html GET and POST request.
    form = cgi.FieldStorage()
    try:
        # Extract ticker_symbol from request.
        ticker = str(form['ticker_symbol'].value)
    except:
        return {'error': 'Invalid parameter'}
    try:
        # Extract interval from request.
        iinterval = str(form['interval'].value)
    except:
        iinterval = '1d'
    try:
        # Extract range from request.
        rrange = str(form['range'].value)
    except:
        rrange = '1y'
    
    # Connects to local database cache
    cnx = mysql.connector.connect(user='api', database='projectapi')
    cursor = cnx.cursor(buffered=True)
    
    # Load result from database cache.
    sql = "SELECT * FROM yahoofinances WHERE ticker='{}' AND iinterval='{}' AND rrange='{}';".format(ticker, iinterval, rrange)
    cursor.execute(sql)
    try:
        """
                If in database cache return the result to the client.    
        """
        data = list(cursor.fetchall()[0])
        if (datetime.now()-timedelta(days=1)) > data[4]:
            raise IndexError('item in database expired')
        results = data[3]
        cursor.close()
        cnx.close()
    except:
        """
                If not in database cache or expired get new result from yahoofiances api.    
        """
        results = site(ticker, iinterval, rrange)
        
        # Offload adding to database on different thread to return results without delay.
        t1 = Thread(target=commit, args=(ticker, iinterval, rrange, results, cursor, cnx,))
        t1.start()

    # Return json results to client.
    return results

if __name__ == '__main__':
    """
        If main thread execute program.
    """
    print('Content-type:application/json', end='\r\n\r\n')  # Informs the client (recipient/browser) of datatype json.
    print(main(), end='')                                   # Executes main function and pass to client.

