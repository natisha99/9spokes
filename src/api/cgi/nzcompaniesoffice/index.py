#!/usr/bin/pypy3
#!/usr/bin/python3

import mysql.connector
import json
import cgi
from urllib.request import Request, urlopen
from datetime import datetime, timedelta
from threading import Thread

def commit(company_number, output, cursor, cnx):
    """
        The commit function adds the results to the mysql database cache.
 
    """
    
    # Two sql quries to remove the result if it has expired and add the new result to the database cache.
    sql1 = "DELETE FROM nzcompaniesoffice WHERE company_number={};".format(company_number)
    # This table uses a single column primary key company_number.
    sql2 = "INSERT INTO nzcompaniesoffice VALUES({}, '{}', '{}');".format(company_number, output, str(datetime.now()))
    cursor.execute(sql1)
    cnx.commit()        # Commiting the delete query before executing insert query.
    cursor.execute(sql2)
    cnx.commit()
    cursor.close()
    cnx.close()         # Close database connection.
    
def worker(html, string):
    """
        Worker thread locates substring of string location.
        
        Intended to be multithreaded but was ultimately deemed unnessasary due to fast execution speed .find() function.
        O(log n), avg processing time: 4 miliseconds
    """
    index = html.find(string)
    if index == -1:
        raise Exception('index not found:{}'.format(string))
    return index + len(string)

def site(company_number):
    """
        Self created companies office nz api.
        The official companies office nz api is very limited and provides us with no useful data.

        So this function retrieves the company profile web page and extracts all the relevant data.
    """

    # Load company profile web page on companies office nz.
    url = 'https://app.companiesoffice.govt.nz/companies/app/ui/pages/companies/{}/detail?backurl=%2Fcompanies%2Fapp%2Fui%2Fpages%2Fcompanies%2F6842293'.format(company_number)
    req = Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    webpage = urlopen(req).read()
    html = webpage.decode('utf-8').replace('\r', '').replace('\n', '')  # Removes all new line characters to reduce memory search footprint.

    # Extracts the maincol from the source
    maincol = html[worker(html, 'id="maincol"'):]
    
    # Divides the maincol into Catagories
    panel1 = maincol[worker(maincol, 'class="pageContainer"'):]
    panel2 = panel1[worker(panel1, 'class="pageContainer"'):]
    panel3 = panel2[worker(panel2, 'class="pageContainer"'):]
    panel4 = panel3[worker(panel3, 'class="pageContainer"'):]
    panel5 = panel4[worker(panel4, 'class="pageContainer"'):]
    panel6 = panel5[worker(panel5, 'class="pageContainer"'):]
    panel7 = panel6[worker(panel6, 'class="pageContainer"'):]

    panel1 = panel1[:worker(panel1, 'class="pageContainer"')]
    panel2 = panel2[:worker(panel2, 'class="pageContainer"')]
    panel3 = panel3[:worker(panel3, 'class="pageContainer"')]
    panel4 = panel4[:worker(panel4, 'class="pageContainer"')]
    panel5 = panel5[:worker(panel5, 'class="pageContainer"')]
    panel6 = panel6[:worker(panel6, 'class="pageContainer"')]
    
    # Catagory 1: Company Summary
    _name = maincol[:worker(maincol, '<span class="entityIdentifier">')-len('<span class="entityIdentifier">')][::-1]
    _name = _name[:worker(_name, '>')-len('>')][::-1].strip()

    _nzbn = panel1[worker(panel1, 'for="nzbn">NZBN:</label>'):]
    _nzbn = int(_nzbn[:worker(_nzbn, '</div>')-len('</div>')].strip())

    _company_number = panel1[worker(panel1, 'for="companyNumber">Company number:</label>'):]
    _company_number = int(_company_number[:worker(_company_number, '</div>')-len('</div>')].strip())

    _incorporation_date = panel1[worker(panel1, 'for="incorporationDate">Incorporation Date:</label>'):]
    _incorporation_date = _incorporation_date[:worker(_incorporation_date, '</div>')-len('</div>')].strip()

    _company_status = panel1[worker(panel1, 'for="companyStatus">Company Status:</label>'):]
    _company_status = _company_status[:worker(_company_status, '</div>')-len('</div>')].strip()

    _entity_type = panel1[worker(panel1, 'for="entityType">Entity type:</label>'):]
    _entity_type = _entity_type[:worker(_entity_type, '</div>')-len('</div>')].strip()

    _constitution_filed = panel1[worker(panel1, 'for="constitutionFiled">Constitution filed:</label>'):]
    _constitution_filed = _constitution_filed[:worker(_constitution_filed, '</div>')-len('</div>')].strip()
    _constitution_filed = 'Yes' if 'Yes' in _constitution_filed else 'No'

    try:
        _ar_filing_month = panel1[worker(panel1, 'for="arFilingMonth">AR filing month:</label>'):]
        _ar_filing_month = _ar_filing_month[:worker(_ar_filing_month, '<')-len('<')].split()[0].strip()
    except:
        _ar_filing_month = None

    _ultimate_holding_company = panel1[worker(panel1, '<label id="ultimateHoldingCompany">Ultimate holding company'):].strip()
    _ultimate_holding_company = _ultimate_holding_company[worker(_ultimate_holding_company, '</label>')+len('</label>'):].strip()
    _ultimate_holding_company = _ultimate_holding_company[:worker(_ultimate_holding_company, '<')-len('<')].strip()

    
    company_summary = {
            'company_number':_company_number,
            'nzbn':_nzbn,
            'incorporation_date':_incorporation_date,
            'company_status':_company_status,
            'entity_type':_entity_type,
            'constitution_filed':_constitution_filed,
            'ar_filing_month':_ar_filing_month,
            'ultimate_holding_company':_ultimate_holding_company,
            'url':url,
            'date_retrieved':str(datetime.now())
            }
    

    # Catagory 2: Company Directors

    directors = []
    while True:
        try:
            panel2 = panel2[worker(panel2, 'for="fullName">Full legal name:</label>'):]
            _full_legal_name = panel2[:worker(panel2, '</div>')-len('</div>')].strip()
            
            panel2 = panel2[worker(panel2, 'for="residentialAddress">Residential Address:</label>'):]
            _residential_address = panel2[:worker(panel2, '</div>')-len('</div>')].strip()
            
            panel2 = panel2[worker(panel2, 'for="appointmentDate">Appointment Date:</label>'):]
            _appointed_date = panel2[:worker(panel2, '</div>')-len('</div>')].strip()
            
            directors.append({
                'full_legal_name':_full_legal_name,
                'residential_address':_residential_address,
                'appointed_date':_appointed_date
                })
        except:
            break

    
    # Catagory 3: Company Shareholdings

    panel3 =  panel3[worker(panel3, '<label>Total Number of Shares:</label><span>'):]
    _total_number_of_shares =  int(panel3[:worker(panel3, '</span>')-len('</span>')].strip())

    panel3 =  panel3[worker(panel3, '<label>Extensive Shareholding:</label>'):]
    _extensive_shareholding = 'Yes' if 'yes' in panel3[:worker(panel3, '</span>')-len('</span>')].strip() else 'no'

    shareholdings = {
        'total_number_of_shares':_total_number_of_shares,
        'extensive_shareholding':_extensive_shareholding,
        'allocation':[]
        }

    _shareholders = []
    while True:
        try:
            panel3 =  panel3[worker(panel3, '</span>:</label>'):]
            _shareholders.append(panel3[:worker(panel3, '</span>:</label>')-len('</span>:</label>')])
        except:
            _shareholders.append(panel3)
            break

    for shareholder in _shareholders:
        _shares = int(shareholder[:worker(shareholder, '<')-len('<')].strip())
        _holders = []
        while True:
            try:
                temp = shareholder[worker(shareholder, '<div class="labelValue col2">'):]
                shareholder = temp[worker(temp, '<div class="labelValue col2">'):]
                temp = temp[:worker(temp, '</div>')-len('</div>')].strip()
                if temp[:2] == '<a':
                    temp = temp[worker(temp, '>'):]
                    temp = temp[:worker(temp, '</a>')-len('</a>')].strip()
                _holders.append([
                    temp,
                    shareholder[:worker(shareholder, '</div>')-len('</div>')].strip()
                    ])
            except:
                break
        shareholdings['allocation'].append([_shares, _holders])
    
    
    # Catagory 4: Company Addresses

    panel4 = panel4[worker(panel4, '<div class="addressLine">'):]
    _registered_office_address = panel4[:worker(panel4, '</div>')-len('</div>')].strip()

    panel4 = panel4[worker(panel4, '<div class="addressLine">'):]
    _address_for_service = panel4[:worker(panel4, '</div>')-len('</div>')].strip()

    try:
        _website = maincol[worker(maincol, 'var website="'):]
        _website = _website[:worker(_website, '"')-len('"')]
    except:
        _website = None
    
    addresses = {
        'registered_office_address':_registered_office_address,
        'address_for_service':_address_for_service,
        'website':_website
        }
    
    
    # Catagory 5: Company PPSR

    ppsr = {}

    
    # Catagory 6: Company NZBN (additional nzbn information)
    
    try:
        _industry = panel1[worker(panel1, 'for="businessClassification">Industry Classification(s):</label>'):]
        _industry = _industry[worker(_industry, '<div>'):]
        _industry = ' '.join(_industry[:worker(_industry, '</div>')-len('</div>')].strip().split(' ')[1:])
    except:
        _industry = None
    nzbn = {'industry':_industry}

    
    # Catagory 7: Company Documents

    documents = {}


    # Output
    
    output = {
        'NAME':_name,
        'INFO':{
            'SUMMARY':company_summary,
            'DIRECTORS':directors,
            'SHAREHOLDINGS':shareholdings,
            'ADDRESSES':addresses,
            'PPSR':ppsr,
            'NZBN':nzbn,
            'DOCUMENTS':documents
        },
        'DATE':company_summary['date_retrieved']
        }
    return json.dumps(output)

def main():
    """
        Executes apropriate functions to retrieve and return results from companies house.
    """

    # Retrieve html GET and POST request.
    form = cgi.FieldStorage()
    try:
        try:
            # Extract company_number from request.
            company_number = int(form['company_number'].value)
        except KeyError:
            return {'error':'missing parameter'}
    except ValueError:
        # Not a number, stop
        return {'error':'Invalid company number: {}'.format(company_number)}
    
    # Connects to local database cache
    cnx = mysql.connector.connect(user='api', database='projectapi')
    cursor = cnx.cursor(buffered=True)

    # Load results from database cache.
    sql = "SELECT * FROM nzcompaniesoffice WHERE company_number={};".format(company_number)
    cursor.execute(sql)
    try:
        """
                If in database cache return the result to the client.    
        """
        data = list(cursor.fetchall()[0])
        if (datetime.now()-timedelta(days=30)) > data[2]:
            raise IndexError('item in database expired')
        output = data[1]
        cursor.close()
        cnx.close()
    except IndexError:
        """
                If not in database cache or expired get new result from yahoofiances api.    
        """
        
        output = site(company_number)

        # Offload adding to database on different thread to return results without delay.
        t1 = Thread(target=commit, args=(company_number, output, cursor, cnx,))
        t1.start()
    
    # Return json results to client.
    return(output)
    
if __name__ == "__main__":
    """
        If main thread execute program.
    """
    print('Content-type:application/json', end='\r\n\r\n')  # Informs the client (recipient/browser) of datatype json.
    print(main(), end='')                                   # Executes main function and pass to client.
