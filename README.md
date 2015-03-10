# antiblog

The goal of this project is to provide a basic framework for anyone who would like to implement
their custom blog site in [meteor](https://meteor.com). It's not meant to be a production ready
application. A production deploy would probably require a lot customization and safety
considerations. Look here for a demo app:

http://antiblog.meteor.com

## Exploring

If you want to play with the application yourself clone the repo and use
```
./start.sh
```
to start your local server with some predefined settings.
The server will generate some fake data.
There are three users, which you can play with
```
example[0-2]@example, password
```
To make sure the s3 uploads works fine you will need to provide
a valid set of credentials in your local settings file:
```javascript
{
  "s3uploader": {
    "accessKeyId": "secret",
    "secretAccessKey": "secret",
    "bucket": "myBucket",
    "prefix": "uploads"
  },
  "public": {
    "s3uploadsPrefix": "https://s3-us-west-2.amazonaws.com/myBucket/uploads/"
  },
}
```

## Disclaimer

This is still work in progress. Any feedback / contribution will be appreciated.

