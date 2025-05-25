# Auction APP

## Installation

1. Copy `.env.example` to `.env` file and setup needed variables
2. Run `docker-compose up` to start Docker containers
3. In Docker container run `node ace generate:key` to generate `APP_KEY`
4. Run `node ace migration:run` to set up DB tables