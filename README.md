# REST-API-Nerdery-Challenge

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary><h2 style="display: inline-block">Table of Contents</h2></summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>



## About The Project

Build a microblog. Users should be able to create an account, sign in, sign up, sign out.
**To avoid retyping too much info. Do a search and replace with your text editor for the following:**
`github_username`, `repo_name`, `twitter_handle`, `email`, `project_title`, `project_description`

### Technical Requirements
* PostgreSQL
* ExpressJS
* Typescript
* Jest
* Prettier
* ESlint


## Getting Started

To get a local copy up and get it running follow these simple steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.

* Software for API Testing: Insomnia, Postman, ...
* PostgreSQL

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/github_username/repo_name.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Change the values in .env following the keys of env.example
  ```sh
  ---DATABASE
  NODE_ENV = "development"

  DATABASE_URL = //PostgreSQL URL

  TOKEN_SECRET = 

  TOKEN_EXPIRES = 

  SENDGRID_API_KEY = 
  ```
  * Do the same for .env.test if you want to have a different database for testing
  
  
5. Run prisma migrations
   ```sh
   npm run prisma:run:migration
   ```
    * Run prisma migrations for the test database
   ```sh
   npm run migrate-dbtest
   ```
   
6. Import .json file into your software for API testing
    * It has been exported from Insomnia  
    * To convert the file into another format collection you can use: https://www.apimatic.io/transformer/


## For testing
* To test posts & comments services
  ```sh
  npm run test
  ```

* To test users & authentication services
  ```sh
  npm run test-auth
  ```



## Authentication

### Sign Up
  `POST` /signup
  * **Response:** `{"Verify your email address"}`

### Verify email
  You will receive an email with the endpoint to verify your user account
  `POST` /received_route
  * **Response:** `{"token": "Verify your email address"}`
  
  After verification you will be able to sign in
  
### Sign in
  `POST` /sign in
  Use the token generated to authenticate the bearer token

### Sign Out
  `POST` /sign out



## No need of authentication

  `GET` /posts
  * Read all the posts in the database
  
  `GET` /comments
  * Read all the comments in the database
  
  `GET` /posts/:postId/likes
  * See the likes & dislikes count
  * Get array with the ids of the users that liked & disliked the selected post 
  
  `GET` /posts/:commentId/likes
   * See the likes & dislikes count
  * Get array with the ids of the users that liked & disliked the selected comment 


## With authentication (Bearer token)

### Users
  `GET` /api/users/:id
  * Get a single user

  `PATCH` /api/users/:id
  * Update profile: bio, fullname, make email or fullname public
  
  
### Posts
  `POST` /api/posts
  * Create a post: if you want to save it as a draft `"published": false`
  * Required input
  ```sh
   {
      "title":
      "content":
      "published": //optional
   }
   ```
   * Output: created post


  `PATCH` /api/posts/:postId
  * Update selected post: title, content, published
  * Output: updated post
 
  
  `DELETE` /api/posts/:postId
  * Delete selected post
  * Output: deleted post
  
  
  `POST` /api/posts/:id/likes
  * Like or dislike a post
  * Required input
    * `{"likeStatus": true}` to like a post
    * `{"likeStatus": false}` to dislike a post
  * Output: number of likes & dislikes, arrays of userId that liked or disliked the post
  ```sh
   {
      "id": 5,
      "title": "TITLE",
      "content": "contenT",
      "likedBy": [ 4, 5],
      "dislikedBy": [],
      "likes": 2,
      "dislikes": 0
    }
   ```
   
   
  
  `POST` /api/posts/:id/comments 
  * Create a comment for the selected post
  * Required input: only content is requires
    * If you  want to save your comment as a draft: `"published": false`
   ```sh
   {
      "content": 
      "published": //optional
    }
   ```


### Comments
  `PATCH` /api/comments/:id
  * Update selected comment: content & published
  * Output: updated comment
 
  
  `DELETE` /api/comments/:id
  * Delete selected comment
  * Output: deletedcomment
  
  
  `POST` /api/comments/:id/likes
  * Like or dislike a comment
  * Required input
    * `{"likeStatus": true}` to like a comment
    * `{"likeStatus": false}` to dislike a comment
  * Output: number of likes & dislikes, arrays of userId that liked or disliked thecomment
  ```sh
   {
      "id": 5,
      "content": "contenT",
      "likedBy": [ 4, 5],
      "dislikedBy": [],
      "likes": 2,
      "dislikes": 0
    }
   ```
   
   



## Team

* Laura Jimenez - https://github.com/LauraJimenezB/REST-API-Nerdery-Challenge
* Diana Ordoñez - https://github.com/DianaSanchezOrdonez/REST-API-Nerdery-Challenge



