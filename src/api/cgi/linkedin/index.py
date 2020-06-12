#!/usr/bin/pypy3
#!/usr/bin/python3

import socket
import mysql.connector
from datetime import datetime, timedelta
from threading import Thread
import cgi

def commit(keyword, results, cursor, cnx):
    sql1 = "DELETE FROM linkedin WHERE keyword=%s;"
    sql2 = "INSERT INTO linkedin VALUES(%s, %s, %s)"
    val2 = (
        keyword,
        results,
        str(datetime.now()))
    cursor.execute(sql1, (keyword,))
    cnx.commit()
    cursor.execute(sql2, val2)
    cnx.commit()
    cursor.close()
    cnx.close()

def expected(dump):
    return True

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
    keyword = 'get:'+str(form['keyword'].value)
    
    cnx = mysql.connector.connect(user='api', database='projectapi')
    cursor = cnx.cursor(buffered=True)
    
    sql = "SELECT * FROM linkedin WHERE keyword=%s;"
    cursor.execute(sql, (keyword,))
    
    cache_results = ''
    cache_expired = False
    fetch_results = ''
    results = ''
    try:
        data = list(cursor.fetchall()[0])
        if (datetime.now()-timedelta(days=180)) > data[2]:
            raise IndexError('item in database expired')
        cache_results = data[1]
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
        elif cache_expired:
            results = cache_results
        else:
            results = json.dumps({'error':'api access problem'})

    return results

if __name__ == '__main__':
    print('Content-type:application/json', end='\r\n\r\n')
    print(main().encode("utf-8", "ignore").decode(encoding='utf-8', errors='ignore'), end='')
