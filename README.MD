## ✏️ English Learning Community Feature

A collaborative tool designed to enhance English learning through peer and teacher interaction:

+ Share your English challenges (especially in writing) or post helpful tips.

+ Auto check grammar, suggestion for fixing right in your post

+ Collaborate with others—teachers or fellow students—to correct, improve, and expand your content.

+ Highlight valuable answers by voting for the most helpful contributions.

This feature encourages active participation, knowledge sharing, and continuous improvement in a supportive community.
## Demo

https://antoree-mvp-client-44rgangr0-txmozkuhs-projects.vercel.app/


## Features

- Authentication & Authorization with JWT 
- Issus Post management
- Vote management



## Run Locally

Clone the project

```bash
  git clone https://github.com/txmozkuh/antoree_mvp.git
```

Go to the project directory (both client & server)

```bash
  cd client
  cd server
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

FROM CLIENT `.env`

`VITE_API_URL` 

FROM SERVER `.env`

`CLIENT_HOST` `REQUEST_BODY_LIMIT` `RATE_LIMIT_WINDOW_MIN` `RATE_LIMIT_MAX`
` CLIENT_HOST` `DB_URL` `JWT_SECRET_KEY`

or just create .env and use my default settings
## Tech Stack

**Language:** Typescript

**Client:** React, Zustand, ShadcnUI, TailwindCSS, Zod

**Server:** Node, Express, Express-validator

**Database:** MongoDB

