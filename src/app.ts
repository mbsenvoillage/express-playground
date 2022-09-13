import * as express from "express";
import * as bodyParser from "body-parser";
import * as mongoose from "mongoose";
import errorMiddleware from "middleware/error.middleware";

class App {
  public app: express.Application;
  public port: number;

  constructor(controllers, port) {
    this.app = express();
    this.port = port;

    // express runs all middlewares from first to last. However error handling
    // middleware should sit at the end otherwise all the others would be bypassed
    this.connectToDb();
    this.initMiddleware();
    this.initControllers(controllers);
    this.initErrorHandling();
  }

  private initMiddleware() {
    this.app.use(bodyParser.json());
  }

  private initControllers(controllers) {
    controllers.forEach((controller) => {
      this.app.use("/", controller.router);
    });
  }

  private initErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private connectToDb() {
    const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env;
    mongoose.connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`);
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on ${this.port}`);
    });
  }
}

export default App;
