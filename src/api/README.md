# The Project's API backend

The project by default uses the remote public server (https://projectapi.co.nz/api/) we created to host the non-local backend code. This was done due to the inability to call most of the api's directly due to security limitations in excel. So we created an intermediary service that creates a secure connection between the client using the spreadsheet taskbar and itself. 
## Getting Started

Hosting this yourself is very simple, below is a rough outline of how to implement it.

### Prerequisites

1. __Domain Name__. 
There are lots of free and paid services, however, it needs to support custom name or provide it's own ssl solution)

2. __SSL__. 
Cloudflare's free solution works great. [https://www.cloudflare.com/ssl/](https://www.cloudflare.com/ssl/)

3. __Hosting Platform__. 
eg. Docker container/virtual machine/physical server with port 443 available. 

4. Obtain valid api token from companies house UK and user account for linkedin.


### Setup

For physical/virtual machines install the host operating system of your choice and load [lamp](https://github.com/teddysun/lamp).
For docker simply load a precompiled [lamp image](https://hub.docker.com/r/mattrayner/lamp).

Optional: Setup mysql database cache.
```
1. Create user and database
2. Import the sql table creation script (setup.sql)

```

Optional: Install pypy3
```
Install https://www.pypy.org/ for jit compiler. 
It reduces script runtime around 40%. 
However insignificant compared to api access time.
```

Install python dependencies:
```
pip install pytrends mysql-connector
```

Goto [https://www.cloudflare.com/ssl/](https://www.cloudflare.com/ssl/) signup and follow their easy guide to setup https on your domain.

In your apache2 config add the following:
```
AddHandler cgi-script .py
Access-Control-Allow-Origin
DirectoryIndex index.py
```


Finally copy the Common Gateway Interface code [https://github.com/natisha99/9spokes/tree/master/src/api/cgi](https://github.com/natisha99/9spokes/tree/master/src/api/cgi) to your local /var/www/html/api directory.

Remember to edit the following and add the valid tokens/user account login details. 
```
/var/www/html/api/ukcompanieshouse/index.py
/var/www/html/api/ukcompanieshouse/search/index.py
/var/www/html/api/linkedin/index.py
/var/www/html/api/linkedin/search/index.py
```
And to modify all instances of https://projectapi.co.nz/ to https://your.domain/ in all the source files to use your hosting instead.

### Starting services

Restart Apache (and MySQL), start linkedin_server.py

```
pypy3 linkedin_server.py
```
Make sure your gateway and firewall allows port 443.
## Running the tests

Using postman or any browser see if you can access the following:

https://your.domain/phpmyadmin

https://your.domain/googletrends?keyword=facebook

https://your.domain/linkedin/search?keyword=facebook

https://your.domain/nzcompaniesoffice/search?keyword=media

https://your.domain/ukcompanieshouse/search?keyword=media

https://your.domain/ukcompanieshouse/search?company_name=facebook




Congratulations, if the above returns data everything works. If not make sure you completed all the above instructions.  



## Runs with
Our implmetation run as a virtual machine under xenserver.

* Ubuntu Server 20.04
* Apache2
* MySQL 8.0
* pypy3.6
* python3.8


## Authors

* **Ruben van der Heyde**
* **Nik Ponomarov**
* **Etienne Naude**
* **Natisha Patel**
* **Ken Fang**

We have all [contributed](https://github.com/natisha99/9spokes/contributors) towards the success of this project

## License

see the [LICENSE.md](https://github.com/natisha99/9spokes/LICENSE.md) file for details

## Acknowledgments

* Thanks to the [Ubuntu](https://github.com/ubuntu) team for creating an open-source os.
* Thanks to the [LAMP](https://github.com/teddysun/lamp) ([Apache](https://www.apache.org/)/[MariaDB](https://mariadb.org/)/[MySQL](http://dev.mysql.com/)) team for making this possible.
* Thanks to the [Python](https://www.python.org/) team for making a very flexible programming language with excellent CGI documentation.
* Thanks to [pytrends](https://pypi.org/project/pytrends/) team for maintaining an up to date solution to accessing google's complicated API.
* Thanks to [nodejs](https://nodejs.org/en/) for an excelent cross-platform javascript runtime enviroment.
* Thanks to all the companies providing us with free APIs to their extensive databanks.
* Special thanks to [https://www.9spokes.com/](https://www.9spokes.com/) for providing us with this fun project.
* Special thanks to Allan for making all this possible.