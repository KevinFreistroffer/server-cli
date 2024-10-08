# NodeJS Express MongoDB CLI

Used in: https://github.com/KevinFreistroffer/NodeJS_Express_MongoDB

The intention is to enforce route creation security (JWT verification middleware, and/or access key verification middleware).

## Usage

create-route -folder user -fileName lambda.ts -verifyToken true -routeType get -verifyAccessKey false

**Security concerning situation:** a developer is creating a route that requires JWT authentication, and forgets to add the JWT verification middleware.

**Why this CLI wouldn't be the best idea:** a developer could ignore this CLI and create a route.

**Resolution:** automate updating the configs anytime a route file is created, adding the route to the private and protected routes.

## What's next?

Most likely will ignore this package and add the updating configs automation feature.
