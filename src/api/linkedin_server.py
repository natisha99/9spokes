#!/usr/bin/pypy3
#!/usr/bin/python3

import json
import selenium
import socket
import os
import threading
from random import randint
from time import sleep
from selenium import webdriver
from selenium.webdriver.firefox.options import Options
from datetime import datetime

queue = []

def website():
    global queue
    #Initialize
    options = Options()
    options.headless = True
    driver = webdriver.Firefox(options=options, executable_path='geckodriver')

    #login
    driver.get("https://www.linkedin.com/login")
    #sleep(5)
    if 'Welcome Back' in driver.page_source:
        try:
            username = driver.find_element_by_id("username")
        except:
            username = driver.find_element_by_id("login-email")

        try:
            password = driver.find_element_by_id("password")
        except:
            password = driver.find_element_by_id("login-password")

        username.send_keys("rubenvanderheyde@gmail.com")
        #sleep(1)
        password.send_keys("grillers")
        #sleep(1)
        try:
            driver.find_element_by_tag_name("button").click()
        except:
            driver.find_element_by_id("login-submit").click()
        #sleep(30)


    while True:
        if len(queue) == 0:
            sleep(0.5)
        else:
            try:
                data, connection = queue.pop(0)
                request, name = data.split(':')
                results = {}
                if request == 'search':
                    driver.get("https://www.linkedin.com/search/results/companies/?keywords={}&origin=CLUSTER_EXPANSION".format(name.replace('+',' ').replace(' ','%20')))
                    #sleep(5)
                    if 'Already on LinkedIn?' in driver.page_source or 'Sign in to LinkedIn' in driver.page_source:
                        driver.get('https://www.linkedin.com/uas/login?session_redirect=https%3A%2F%2Fwww%2Elinkedin%2Ecom%2Fsearch%2Fresults%2Fcompanies%2F%3Fkeywords%3D{}%26origin%3DCLUSTER_EXPANSION&fromSignIn=true&trk=cold_join_sign_in'.format(name.replace('+', ' ').replace(' ', '%2520')))
                        #sleep(5)
                        
                        try:
                            username = driver.find_element_by_id("username")
                        except:
                            username = driver.find_element_by_id("login-email")

                        try:
                            password = driver.find_element_by_id("password")
                        except:
                            password = driver.find_element_by_id("login-password")

                        username.send_keys("")      #Enter email here
                        #sleep(1)
                        password.send_keys("")      #Enter password here
                        #sleep(1)
                        try:
                            driver.find_element_by_tag_name("button").click()
                        except:
                            driver.find_element_by_id("login-submit").click()
                        #sleep(30)
                    else:
                        pass
                    rows = driver.find_elements_by_class_name("search-result__occluded-item")
                    results['results'] = []
                    for r in rows:
                        try:
                            results['results'].append(r.find_element_by_tag_name('a').get_attribute('href').split('company/')[1][:-1])
                        except:
                            pass

                elif request == 'get':
                    driver.get("https://www.linkedin.com/company/{}/about/".format(name.replace('+',' ').replace(' ','-')))
                    #sleep(5)
                    if 'Already on LinkedIn?' in driver.page_source or 'Sign in to LinkedIn' in driver.page_source:
                        driver.get('https://www.linkedin.com/uas/login?session_redirect=https%3A%2F%2Fwww%2Elinkedin%2Ecom%2Fcompany%2F{}%2Fabout%2F&trk=public_authwall_company-login-link'.format(name.replace('+',' ').replace(' ','-')))
                        #sleep(5)

                        try:
                            username = driver.find_element_by_id("username")
                        except:
                            username = driver.find_element_by_id("login-email")

                        try:
                            password = driver.find_element_by_id("password")
                        except:
                            password = driver.find_element_by_id("login-password")

                        username.send_keys("rubenvanderheyde@gmail.com")
                        #sleep(1)
                        password.send_keys("grillers")
                        #sleep(1)
                        try:
                            driver.find_element_by_tag_name("button").click()
                        except:
                            driver.find_element_by_id("login-submit").click()
                        #sleep(30)
                    else:
                        pass
                    if not (('Oops!' in driver.page_source) and ('This page is not available' in driver.page_source)):
                        overview = driver.find_element_by_class_name("white-space-pre-wrap").text
                        _section = driver.find_elements_by_class_name("overflow-hidden")[1]
                        website = _section.find_element_by_tag_name('a').get_attribute('href')
                        #_html = _section.get_attribute('innerHTML')

                        _rest = _section.find_elements_by_class_name("org-page-details__definition-text")
                        industry = _rest[1].text
                        ttype = _rest[2].text
                        specialties = _rest[3].text
                        company_size = _section.find_element_by_class_name("org-about-company-module__company-size-definition-text").text

                        results['results'] = {
                            'overview':overview,
                            'website':website,
                            'industry':industry,
                            'company_size':company_size,
                            'type':ttype,
                            'specialities':specialties,
                            'url':'https://www.linkedin.com/company/{}'.format(name)
                            }
                    else:
                        results['results'] = {
                            'overview':'',
                            'website':'',
                            'industry':'',
                            'company_size':'',
                            'type':'',
                            'specialities':'',
                            'url':''
                            }
            except Exception as e:
                print(datetime.now(), e)
                results = {
                        'results':{
                            'overview':'',
                            'website':'',
                            'industry':'',
                            'company_size':'',
                            'type':'',
                            'specialities':'',
                            'url':''
                            }
                        }
            finally:
                connection.sendall(str.encode(json.dumps(results)))
                connection.close()
    driver.quit()

def tcp_server():
    global queue
    ServerSocket = socket.socket()
    host = '127.0.0.1'
    port = 1233
    try:
        ServerSocket.bind((host, port))
    except socket.error as e:
        print(str(e))
    ServerSocket.listen(5)
    while True:
        connection , address = ServerSocket.accept()
        print('Connected to: ' + address[0] + ':' + str(address[1]))
        data = connection.recv(4096)
        if not data:
            connection.close()
        else:
            queue.append((data.decode('utf-8'),connection,))
    ServerSocket.close()
    

def main():
    website_thread = threading.Thread(target=website)
    tcp_thread = threading.Thread(target=tcp_server)
    website_thread.start()
    tcp_thread.start()
    website_thread.join()
    tcp_thread.join()

if __name__ =='__main__':    
    main()
    
