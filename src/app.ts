import * as express from "express";
import * as bodyParser from "body-parser";
import * as mongoose from "mongoose";

class App {
  public app: express.Application;
  public port: number;

  constructor(controllers, port) {
    this.app = express();
    this.port = port;
    this.initMiddleware();
    this.initControllers(controllers);
    this.connectToDb();
  }

  private initMiddleware() {
    this.app.use(bodyParser.json());
  }

  private initControllers(controllers) {
    controllers.forEach((controller) => {
      this.app.use("/", controller.router);
    });
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
