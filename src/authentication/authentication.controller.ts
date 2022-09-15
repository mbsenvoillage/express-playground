import UserWithThatEmailAlreadyExistsException from "exceptions/UserWithThatEmailAlreadyExistsException";
import * as express from "express";
import * as bcrypt from "bcrypt";
import Controller from "interfaces/controller.interface";
import CreateUserDto from "users/user.dto";
import userModel from "users/user.model";
import LogInDto from "./login.dto";
import WrongCredentialsException from "exceptions/WrongCredentialsException";
import validationMiddleware from "middleware/validation.middleware";

class AuthenticationController implements Controller {
  path: string = "/auth";
  router = express.Router();
  user = userModel;

  constructor() {
    this.initRoutes();
  }

  private initRoutes() {
    this.router.post(
      `${this.path}/register`,
      validationMiddleware(CreateUserDto),
      this.register
    );
    this.router.post(
      `${this.path}/login`,
      validationMiddleware(LogInDto),
      this.login
    );
  }

  private async register(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const userData: CreateUserDto = req.body;

    if (await this.user.findOne({ email: userData.email })) {
      next(new UserWithThatEmailAlreadyExistsException(userData.email));
    } else {
      let hashedPass = await bcrypt.hash(userData.password, 10);
      const createUser = await this.user.create({
        ...userData,
        password: hashedPass,
      });
      createUser.password = undefined;
      res.send(createUser);
    }
  }

  private async login(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const userData: LogInDto = req.body;
    const user = await this.user.findOne({ email: userData.email });

    if (user) {
      const isPasswordMatching = await bcrypt.compare(
        userData.password,
        user.password
      );
      if (isPasswordMatching) {
        user.password = undefined;
        res.send(user);
      } else {
        next(new WrongCredentialsException());
      }
    } else {
      next(new WrongCredentialsException());
    }
  }
}

export default AuthenticationController;
