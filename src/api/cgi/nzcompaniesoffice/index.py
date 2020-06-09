#!/usr/bin/pypy3
#!/usr/bin/python3

import mysql.connector
import json
import cgi
from urllib.request import Request, urlopen
from datetime import datetime, timedelta
from threading import Thread

def commit(company_number, output, cursor, cnx):
    # Commit to database
    sql1 = "DELETE FROM nzcompaniesoffice WHERE company_number={};".format(company_number)
    sql2 = "INSERT INTO nzcompaniesoffice VALUES({}, '{}', '{}');".format(company_number, output, str(datetime.now()))
    cursor.execute(sql1)
    cnx.commit()
    cursor.execute(sql2)
    cnx.commit()
    cursor.close()
    cnx.close()
    
def worker(html, string):
    index = html.find(string)
    if index == -1:
        raise Exception('index not found:{}'.format(string))
    return index + len(string)

def site(company_number):
    #url = 'http://10.0.0.10/removed.html'
    #url = 'https://projectapi.co.nz/demo.html'
    url = 'https://app.companiesoffice.govt.nz/companies/app/ui/pages/companies/{}/detail?backurl=%2Fcompanies%2Fapp%2Fui%2Fpages%2Fcompanies%2F6842293'.format(company_number)
    req = Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    webpage = urlopen(req).read()
    html = webpage.decode('utf-8').replace('\r', '').replace('\n', '')

    # maincol
    maincol = html[worker(html, 'id="maincol"'):]
    
    # Catagories
    panel1 = maincol[worker(maincol, 'class="pageContainer"'):]
    panel2 = panel1[worker(panel1, 'class="pageContainer"'):]
    panel3 = panel2[worker(panel2, 'class="pageContainer"'):]
    panel4 = panel3[worker(panel3, 'class="pageContainer"'):]
    panel5 = panel4[worker(panel4, 'class="pageContainer"'):]
    panel6 = panel5[worker(panel5, 'class="pageContainer"'):]
    panel7 = panel6[worker(panel6, 'class="pageContainer"'):]
    panel7 = panel7[worker(panel7, 'class="pageContainer"'):]

    panel1 = panel1[:worker(panel1, 'class="pageContainer"')]
    panel2 = panel2[:worker(panel2, 'class="pageContainer"')]
    panel3 = panel3[:worker(panel3, 'class="pageContainer"')]
    panel4 = panel4[:worker(panel4, 'class="pageContainer"')]
    panel5 = panel5[:worker(panel5, 'class="pageContainer"')]
    panel6 = panel6[:worker(panel6, panel7)]
    
    # Company Summary
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
            'url':url.split('?')[0],
            'date_retrieved':str(datetime.now().date())
            }
    

    # Company Directors

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

    
    # Company Shareholdings

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
    
    
    # Company Addresses

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
    
    
    # Company PPSR

    ppsr = {}

    
    # Company NZBN (additional nzbn information)
    
    try:
        _industry = panel1[worker(panel1, 'for="businessClassification">Industry Classification(s):</label>'):]
        _industry = _industry[worker(_industry, '<div>'):]
        _industry = ' '.join(_industry[:worker(_industry, '</div>')-len('</div>')].strip().split(' ')[1:])
    except:
        _industry = ''

    try:
        _gst_number = panel6[worker(panel6, 'for="gstNumber">GST Number(s):</label>'):]
        _gst_number = _gst_number[worker(_gst_number, 'class="nzbnDetails">'):]
        _gst_number = _gst_number[:worker(_gst_number, '<')-len('<')].strip()
    except:
        _gst_number = ''

    try:
        _website = panel6[worker(panel6, 'for="website">Website(s):</label>'):]
        if worker(_website, '<a href="') > worker(_website, '</div>'):
            raise Exception('No data')
        _website = _website[worker(_website, '<a href="'):]
        _website = _website[:worker(_website, '"')-len('"')].strip()
    except:
        _website = ''

    try:
        _phone_number = panel6[worker(panel6, 'for="phone">Phone Number(s):</label>'):]
        _phone_number = _phone_number[worker(_phone_number, '>'):]
        _phone_number = _phone_number[:worker(_phone_number, '<')-len('<')].strip()
    except:
        _phone_number = ''

    try:
        _email_address = panel6[worker(panel6, 'for="email">Email Address(es):</label>'):]
        if worker(_email_address, '<a href="') > worker(_email_address, '</div>'):
            raise Exception('No data')
        _email_address = _email_address[worker(_email_address, '<a href="'):]
        _email_address = _email_address[:worker(_email_address, '<')-len('<')].strip().split(':')[1]
    except:
        _email_address = ''

    try:
        _trading_name = panel6[worker(panel6, 'for="tradingName">Trading Name(s):</label>'):]
        _trading_name = _trading_name[worker(_trading_name, 'class="nzbnDetails">'):]
        _trading_name = _trading_name[:worker(_trading_name, '<')-len('<')].strip()
    except:
        _trading_name = ''

    try:
        _trading_area = panel6[worker(panel6, 'for="tradingAreas">Trading Area(s):</label>'):]
        _trading_area = _trading_area[worker(_trading_area, 'class="nzbnDetails">'):]
        _trading_area = _trading_area[:worker(_trading_area, '<')-len('<')].strip()
    except:
        _trading_area = ''

    try:
        _abn = panel6[worker(panel6, 'for="ABNNumber">Australian Business Number (ABN):</label>'):]
        _abn = _abn[worker(_abn, 'class="nzbnDetails">'):]
        _abn = _abn[:worker(_abn, '<')-len('<')].strip()
    except:
        _abn = ''
    
    
    nzbn = {
        'gst_number':_gst_number if len(_gst_number)!=0 else 'Not Listed',
        'website':_website if len(_website)!=0 else 'Not Listed',
        'phone_number':_phone_number if len(_phone_number)!=0 else 'Not Listed',
        'email_address':'Not Listed',
        'trading_name':_trading_name if len(_trading_name)!=0 else 'Not Listed',
        'trading_area':_trading_area if len(_trading_area)!=0 else 'Not Listed',
        'industry':_industry if len(_industry)!=0 else 'Not Listed',
        'abn':_abn if len(_abn)!=0 else 'Not Listed'
        }

    
    # Company Documents

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
    form = cgi.FieldStorage()
    try:
        try:
            company_number = int(form['company_number'].value)
            #company_number=3538758
            #company_number=9538759
            #company_number=623457
            #company_number=676632
        except KeyError:
            # For testing outside browser and wrong browser request
            return {'error':'missing parameter'}
    except ValueError:
        # Not a number, stop
        return {'error':'Invalid company number: {}'.format(company_number)}
    cnx = mysql.connector.connect(user='api', database='projectapi')
    cursor = cnx.cursor(buffered=True)
    # Load from database
    sql = "SELECT * FROM nzcompaniesoffice WHERE company_number={};".format(company_number)
    cursor.execute(sql)
    try:
        data = list(cursor.fetchall()[0])
        if (datetime.now()-timedelta(days=30)) > data[2]:
            raise IndexError('item in database expired')
        output = data[1]
        cursor.close()
        cnx.close()
    except IndexError:  # Not in database or expired
        # Load from companiesregister.py
        try:
            output = site(company_number)
        except:
            output = json.dumps({'error':'removed'})
        # Add to database
        # Offload to different thread
        t1 = Thread(target=commit, args=(company_number, output, cursor, cnx,))
        t1.start()
        #commit(company_number, output, cursor, cnx)
    
    # Return output
    return(output)
    
if __name__ == "__main__":
    #import time
    #start = time.time()
    print('Content-type:application/json', end='\r\n\r\n')
    print(main(), end='')
    #print('\r\n\r\n{}s'.format(time.time()-start))
