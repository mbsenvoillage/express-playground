## Middleware

the middleware fn have access to req and res, then next function is called to execute the next middleware in the chain

```(javascript)
function loggerMiddleware(req: express.Request, res: express.Response, next) {
  console.log(`${req.method} ${req.path}`);
  next();
}

app.use(loggerMiddleware);
```

## Router

this router is also a middleware you attach to your app

```
const router = express.Router();
router.get("/health", (req, res) => {
  res.send("Service OK");
});

app.use("/", router);
```

## How this App works

### DTO

Data Transfer Object => data format used between user input and db insertion (or the other way round).
Ex: a request is made with data passed in the request body. That data should have the same structure as the DTO.

### Entity Interface

Entity structure used as a model to create Mongo Document

### Entity Model

The model is passed to the db and reflects the entity interface (share the same properties)

### Controller

The controller is responsible for handling use-case logic (get, post, patch put). In our case, it is a collection of express routes, combined with middlewares.

The controller has a path property (api endpoint) and a router property (express router).

Each route has a path and a handler function. The handler function receives the req and res object and the next function.
There is a default error handler built into Express. To use it, you need to call the next function with an argument. If an error occurs, a new custom exception is passed to the next function.

The route either returns a successful or error response.

### Middleware

#### Error middleware

Error middleware has access to req, res and next, but also to the error object as first param. The error middleware is the last in the list and returns the status and message from the passed error.

#### Validation middlware

OUr validation middleware takes a type and returns a function that taks the req, res and next as param. It compares the req body with the type passed and concatenates error messages from class-validator. If there are any errors it calls next with a new HttpException
