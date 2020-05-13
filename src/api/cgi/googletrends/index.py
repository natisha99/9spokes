#!/usr/bin/python3

import pandas as pd
from request import TrendReq
import cgi
import json
import mysql.connector
from datetime import datetime, timedelta
from threading import Thread

def commit(keyword, results, cursor, cnx):
    """
        The commit function adds the results to the mysql database cache.
 
    """

    # Two sql quries to remove the result if it has expired and add the new result to the database cache.
    sql1 = "DELETE FROM googletrends WHERE keyword='{}';".format(keyword)
    # This table uses a single column primary key keyword(s).
    sql2 = "INSERT INTO googletrends VALUES('{}', '{}', '{}', '{}');".format(
        keyword,
        'https://trends.google.com/trends/explore?q={}'.format(keyword.replace(' ', '+')),  # The location source.
        str(results),
        str(datetime.now()))
    cursor.execute(sql1)
    cnx.commit()        # Commiting the delete query before executing insert query.
    curosr.execute(sql2)
    cnx.commit()
    cursor.close()
    cnx.close()         # Close database connection.

def site(keyword):
    """
        Retrieves and decode the result from google api.
        
        ***Incomplete, but fully functional.***
        Atm it relies on an external library that is known for bad practice to execute multiple api requests per request.
        It also uses pandas unnessasarily for a small dataset. It only adds complexity and latency.
        This is a stop-gap until my (rubenpngfm) version is functional. Current difficuties are access token problems.
    """
    pytrend = TrendReq()
    pytrend.build_payload(kw_list=[keyword])
    df = pytrend.interest_over_time()
    data = df[keyword][::-1]
    dates = [d for d in df.index.astype(str)[::-1]]
    
    results = []
    for i in range(len(data)):
        results.append([str(dates[i]), int(data[i])])
    return {'series':results}

def main():
    """
        Main function executes client request by returning appropriate json results from either the local cache or remote api.
    """

    # Retrieve html GET and POST request.
    form = cgi.FieldStorage()

    try:
        # Extract keyword from request.
        keyword = str(form['keyword'].value)
    except:
        return {'error': 'Invalid parameter'}
    try:
        # Extract number of weeks interval from request.
        weeks = int(form['weeks'].value)
    except:
        weeks = 52
    
    # Connects to local database cache
    cnx = mysql.connector.connect(user='api', database='projectapi')
    cursor = cnx.cursor(buffered=True)
    
    # Load result from database cache.
    sql = "SELECT * FROM googletrends WHERE keyword='{}';".format(keyword)
    cursor.execute(sql)
    try:
        """
                If in database cache return the result to the client.    
        """
        data = list(cursor.fetchall()[0])
        if (datetime.now()-timedelta(days=7)) > data[3]:
            raise IndexError('item in database expired')
        results = json.loads(data[2])
        cursor.close()
        cnx.close()
    except:
        """
                If not in database cache or expired get new result from googletrends api.    
        """
        results = site(keyword)
        
        # Offload adding to database on different thread to return results without delay.
        t1 = Thread(target=commit, args=(keyword, json.dumps(results), cursor, cnx,))
        t1.start()

    # Extracts requested number of weeks from data
    results['series'] = results['series'][:weeks]
    try:
        # Adjust data to fit gogole % model for number of weeks selected.
        factor = 100/max([w[1] for w in results['series']])
        results['series'] = [[x[0],int(x[1]*factor)] for x in results['series']]
    except ZeroDivisionError:
        # If period contains no data prevent divide by zero error and return empty dataset (zeros).
        pass

    # Return json results to client.
    return results

if __name__ == '__main__':
    """
        If main thread execute program.
    """
    print('Content-type:application/json', end='\r\n\r\n')  # Informs the client (recipient/browser) of datatype json.
    print(json.dumps(main()), end='')                       # Executes main function and pass json output to client.
