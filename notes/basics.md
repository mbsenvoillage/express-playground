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
