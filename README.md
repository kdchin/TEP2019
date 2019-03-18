# TEP2019

## Setting up the project
### Dependencies
#### [Python 3.4-3.6](https://www.python.org/downloads/).
I think other versions work too, but not sure. This will automatically give you the `pip3` package installer, which we need to install the following modules. You might have this already.

#### Django 2.1
We are using Django 2.1.7. [Install](https://docs.djangoproject.com/en/2.1/intro/install/) for your whole computer:
```
pip3 install django
```
then verify that it installed correctly:
```
python 3
>> import django
>> print(django.get_version())
2.1.7
```
Alternatively, set up a [virtual environment](https://virtualenv.pypa.io/en/latest/installation/) and install django within that environment.

#### Coverage 4.5.2
We'll be using the [coverage package](https://pypi.org/project/coverage/) for unit testing.
```
pip3 install coverage
```

#### Pyscopg2
[This package](http://initd.org/psycopg/docs/install.html) helps django talk with the PostgreSQL database (which we will set up later)
```
pip3 install psycopg2
```
or `pip install psycopg2`.

Alternatively, you can download the whole thing [here](http://initd.org/psycopg/) and install it with 
```
python setup.py build
python setup.py install
```
#### PostgreSQL
Get it from [here](https://www.postgresql.org/) if you don't already have it from 262.

#### Connecting Django with Postgres
[Follow this article](https://medium.com/agatha-codes/painless-postgresql-django-d4f03364989) (start at step 1--don't need her starter project becauuse we have one). The code part should be set up for you already (you just need to connect your postgres instance to the project). You can add environment variables like this:
```
vim ~/.bash_profile
```
and then adding the following to that file:
```
export TEP_DB_NAME="<YOUR DB NAME>"
export TEP_DB_ADMIN="<YOUR DB ADMIN NAME>"
export TEP_DB_PWD="<YOUR DB PASSWORD>"
```
Also, I made an email for an admin user: tep.tallyhq@gmail.com

 You shouldn't need it since you'll be running it locally, so feel free to use your own email. I know the password for the TEP email so let me know!
```
pip install django-cors-headers
```

We also need a rest framework for the api. Run
```
pip3 install djangorestframework
pip3 install djangorestframework-jwt
```
[Django RESTful Framework](https://www.django-rest-framework.org/tutorial/quickstart/)

#### Django + Angular
(haven't done this yet)
https://medium.com/swlh/django-angular-4-a-powerful-web-application-60b6fb39ef34

## Running the project
First, if you are using a virtualenv, locate the environment (should be named `env`) and run
```
source env/bin/activate
```
so that python can find the right django and other python packages.

Now, we need to run the project's backend (django). Within `/backend` run
```
python3 manage.py makemigrations
python3 manage.py migrate
```
Then try running the server:
```
python3 manage.py runserver
```

Now we need to run the frontend. Within `/djangular` run
```
ng serve
```
It should compile and you should visit `localhost:4200` to view the webapp.


## Testing
All tests are in `tallyhq/tests.py`. To run all tests, run:
```
coverage run --source='.' manage.py test tallyhq
```
And to view a coverage report, run `coverage report`
Note: every time you change a model, you need to migrate the database again.

To get into a shell:
```
python3 manage.py shell
```

[Many to many example](https://gist.github.com/jacobian/827937)

[Heroku](https://www.codementor.io/jamesezechukwu/how-to-deploy-django-app-on-heroku-dtsee04d4)