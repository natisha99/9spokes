#!/usr/bin/pypy3

import socket
import mysql.connector
from datetime import datetime, timedelta
from threading import Thread
import cgi

def commit(keyword, results, cursor, cnx):
    sql1 = "DELETE FROM linkedin WHERE keyword='{}';".format(keyword)
    sql2 = "INSERT INTO linkedin VALUES(%s, %s, %s)"
    val2 = (
        keyword,
        results,
        str(datetime.now()))
    #print(sql2)
    cursor.execute(sql1)
    cnx.commit()
    cursor.execute(sql2, val2)
    cnx.commit()
    cursor.close()
    cnx.close()

def site(keyword):
    ClientSocket = socket.socket()
    ClientSocket.settimeout(60)
    host = '127.0.0.1'
    port = 1233

    try:
        ClientSocket.connect((host, port))
    except socket.error as e:
        print(str(e))

    ClientSocket.send(str.encode(keyword))
    Response = ClientSocket.recv(4096)

    ClientSocket.close()    
    return Response.decode('utf-8')


def main():
    form = cgi.FieldStorage()
    keyword = 'search:'+str(form['keyword'].value)
    #keyword = 'get:air-new-zealand'
    
    
    # Start sql connector
    cnx = mysql.connector.connect(user='api', database='projectapi')
    cursor = cnx.cursor(buffered=True)
    # Load from database
    sql = "SELECT * FROM linkedin WHERE keyword='{}';".format(keyword)
    cursor.execute(sql)
    try:
        data = list(cursor.fetchall()[0])
        if (datetime.now()-timedelta(days=180)) > data[2]:
            raise IndexError('item in database expired')
        results = data[1]
        cursor.close()
        cnx.close()
    except:  # Not in database or expired
        results = site(keyword)
        # Offload to different thread
        #t1 = Thread(target=commit, args=(keyword, results, cursor, cnx,))
        #t1.start()
        # If failed to offload, continue on same thread
        commit(keyword, results, cursor, cnx)

    return results

if __name__ == '__main__':
    print('Content-type:application/json', end='\r\n\r\n')
    print(main(), end='')
