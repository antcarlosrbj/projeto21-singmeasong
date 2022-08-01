<p align="center">
  <a href="https://github.com/antcarlosrbj/projeto21-singmeasong">
    <img src="https://notion-emojis.s3-us-west-2.amazonaws.com/prod/svg-twitter/1f399-fe0f.svg" alt="SingMeASongs-logo" width="100" height="100">
  </a>

  <h3 align="center">
    Sing me a songs
  </h3>
</p>

![](https://user-images.githubusercontent.com/98707235/182051586-af8c0533-e6d8-46de-b6e0-57bdbc6a7f85.gif)

## Usage

```
$ git clone https://github.com/antcarlosrbj/projeto21-singmeasong

$ cd projeto21-singmeasong
```

##### Back-end
```
$ cd back-end

$ npm install

$ npx prisma init

$ npx prisma migrate dev

$ npx prisma generate

$ npm run dev
```

> ```
> $ cd ..
> ```

##### Front-end
```
$ cd front-end

$ npm install

$ npm start
```

## Testes

##### Integration
```
$ cd back-end

$ npm run test:int
```

##### End-to-End (E2E)
```
$ cd back-end

$ npm run dev:test
```
> ```
> $ cd ..
> ```
```
$ cd front-end

$ npm start

$ npx cypress open
```

##### Unit
```
$ cd back-end

$ npm run test:unit
```

## API:

```
- POST /recommendations
    - Route to register new recommendation
    - headers: {}
    - body: {
        "name": "Falamansa - Xote dos Milagres",
        "youtubeLink": "https://www.youtube.com/watch?v=chwyjJbcs1Y"
    }


- POST /recommendations/:id/upvote
    - Route to upvote recommendations
    - headers: {}
    - body: {}


- POST /recommendations/:id/downvote
    - Route to downvote recommendations
    - headers: {}
    - body: {}


- GET /recommendations
    - Route to get all the last 10 recommendations
    - headers: {}
    - body: {}


- GET /recommendations/:id
    - Route to get a recommendation by its ID
    - headers: {}
    - body: {}


- GET /recommendations/random
    - Route to get a random recommendation
    - headers: {}
    - body: {}


- GET /recommendations/top/:amount
    - Route to list the songs with the most points and their score
    - headers: {}
    - body: {}
 
```