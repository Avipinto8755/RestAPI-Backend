
# Project Rest API - Node.JS

Server-side development for a web application, a website management system that allows business users
Publish content, edit and delete it.



## Tech Stack

**Server:** Node.js

- Using a database of MongoDB & MongoDB Atlas
- Using a express.js 
 Using libraries:
 bcryptjs, joi, jsonwebtoken, config, morgan, cors and mongoose


## API Reference

#### Users end point


| URL | method | Authorization | action  | return |
| :-- | :----- | :------------ | :-----  | :----- |
| `/users` | `POST` | `all` | `register user` | `user` | 
| `//users/login ` | `POST` | `all` | ` login` | `Encry pt token` | 
| `/users` | `GET` | `admin` | `Get all users` | `Array of users` | 
| `/users/:id` | `GET` | `The registered user or admin` | `Get user` | `user` | 
| `/users/:id ` | `PUT` | `The registered user` | `edit user` | `user` | 
| `/users/:id ` | `PATCH` | `register user` | `change isBusiness status` | `user` | 
| `/users/:id ` | `DELETE` | `The registered user or admin` | `Delete user` | `Delete d user` | 



#### Cards

| URL | method | Authorization | action  | return |
| :-- | :----- | :------------ | :-----  | :----- |
| `/cards ` | `GET` | `all` | `All cards` | `cards` | 
| `/cards/my-cards ` | `GET` | `the registered user` | `get users cards` | `array of cards` | 
| `/cards/:id ` | `GET` | `all` | `get card` | `card` | 
| `/cards ` | `POST` | `business user` | `create new card` | `card` |
| `/cards/:id ` | `PUT` | `The user who created the card` | `edit card` | `card` | 
| `/cards/:id ` | `PATCH` | `A registered user` | `like card` | `card` |
| `/cards/:id ` | `DELETE` | `The user who created the card or admin` | `delete card` | ` deleted card` |   




## 🚀 About Me
I'm a full stack web developer.
my git link : https://github.com/Avipinto8755
