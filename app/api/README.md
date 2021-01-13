
# API

#### Prerequisite
```
npm install
```

##### Start
```
npm start

```

#### Start a mongodb for storing user data
```
docker run -d -p 27017-27019:27017-27019 --name sota_console_db mongo
```

```

#### RegisterUser
```
node register email password role
node register test@example.com 123456 admin
```
