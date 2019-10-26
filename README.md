# ![Next.Js (React Universal) Real World Example App](project-name.jpg)

[![RealWorld Frontend](https://img.shields.io/badge/realworld-frontend-%23783578.svg)](http://realworld.io)

> ### Next.Js Server Side Rendering codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the [RealWorld](https://github.com/gothinkster/realworld-example-apps) spec and API.


### [Demo](https://nextjs-ssr-real-world-example.herokuapp.com/)&nbsp;&nbsp;&nbsp;&nbsp;[RealWorld](https://github.com/gothinkster/realworld)

This codebase was created to demonstrate a fully fledged fullstack application built with **[NEXT.JS]** including CRUD operations, authentication, routing, pagination, and more.

We've gone to great lengths to adhere to the **[NEXT.JS+REACT.JS]** community styleguides & best practices.

For more information on how to this works with other frontends/backends, head over to the [RealWorld](https://github.com/gothinkster/realworld) repo.

## Getting started

You can view a live demo over at https://nextjs-ssr-real-world-example.herokuapp.com/

To get the app running locally:

- Clone this repo
- `npm install` to install all req'd dependencies
- `npm run build` to build the app
- `npm start` to start the local server


### Making requests to the backend API

For convenience, we have a live API server running at https://conduit.productionready.io/api for the application to make requests against. You can view [the API spec here](https://github.com/GoThinkster/productionready/blob/master/api) which contains all routes & responses for the server.

The source code for the backend server (available for Node, Rails and Django) can be found in the [main RealWorld repo](https://github.com/gothinkster/realworld).

If you want to change the API URL to a local server, simply edit `src/config.js` and change `mainApiEndpoint` to the local server's URL (i.e. `localhost:8000/api`)


## Functionality overview

The example application is a social blogging site (i.e. a Medium.com clone) called "Conduit". It uses a custom API for all requests, including authentication. You can view a live demo over at https://next-ssr-real-world-app.now.sh/

**General functionality:**

- Authenticate users via JWT (login/signup pages + logout)
- CRU* users (sign up & settings page - no deleting required)
- CRUD Articles
- CR*D Comments on articles (no updating required)
- GET and display paginated lists of articles
- Favorite articles
- Follow other users

**The general page breakdown looks like this:**

- Home page (URL: / )
    - List of tags
    - List of articles pulled from either Feed, Global, or by Tag
    - Pagination for list of articles
- Sign in/Sign up pages (URL: /login, /sign-up )
    - Use JWT (store the token in localStorage)
- Settings page (URL: /setting )
- Editor page to create/edit articles (URL: /update-post, /update-post/edit/article-slug-here )
- Article page (URL: /post/article-slug-here )
    - Delete article button (only shown to article's author)
    - Render markdown from server client side
    - Comments section at bottom of page
    - Delete comment button (only shown to comment's author)
- Profile page (URL: /user-profile/username)
    - Show basic user info
    - List of articles populated from author's created articles or author's favorited articles

<br />

[![Brought to you by Thinkster](https://raw.githubusercontent.com/gothinkster/realworld/master/media/end.png)](https://thinkster.io)