# swpp2020-team1

[![Build Status](https://travis-ci.org/swsnu/swpp2020-team1.svg?branch=master)](https://travis-ci.org/swsnu/swpp2020-team1)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=swsnu_swpp2020-team1&metric=alert_status)](https://sonarcloud.io/dashboard?id=swsnu_swpp2020-team1)
[![Coverage Status](https://coveralls.io/repos/github/swsnu/swpp2020-team1/badge.svg?branch=master)](https://coveralls.io/github/swsnu/swpp2020-team1?branch=master)

Foodify, an all-in-one refrigerator management service

# Frontend  
### Run  
```Bash
cd frontend
yarn install
yarn start
```

### Test
```Bash
cd frontend
yarn install
yarn test --coverage --watchAll=false
```

# Backend
### Run
```Bash
cd backend
python manage.py makemigrations
python manage.py migrate
python manage.py runserver 
```

### Test 
```Bash
cd backend
coverage run --source='./api' manage.py test
```
