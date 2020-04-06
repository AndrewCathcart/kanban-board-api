# nestjs-todo [![CircleCI](https://circleci.com/gh/AndrewCathcart/nestjs-todo.svg?style=svg)](https://app.circleci.com/pipelines/github/AndrewCathcart/nestjs-todo)

## Description

This repo contains the backend code for a todo app that I'm working on for fun in order practice the following;

- [Nest](https://github.com/nestjs/nest)
- Unit & Integration Testing
- Docker & docker-compose
- Microservice Architecture vs Service Oriented Architecture
- CI & CD

## Installation

Prerequisites

- [Node](https://nodejs.org/en/) is required. This can be installed via the website or by using [nvm](https://github.com/nvm-sh/nvm) (see their documentation).
- [Docker](https://docs.docker.com/install/) for local development.

Then install dependencies

```bash
$ npm install
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Running the app

```bash
# development
$ docker-compose up --build
```
