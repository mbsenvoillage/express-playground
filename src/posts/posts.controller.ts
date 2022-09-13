import HttpException from "exceptions/HttpExceptions";
import PostNotFoundException from "exceptions/PostNotFoundException";
import * as express from "express";
import Post from "./post.interface";
import postModel from "./posts.model";

class PostsController {
  public path = "/posts";
  public router = express.Router();

  constructor() {
    this.initRoutes();
  }

  public initRoutes() {
    this.router.get(this.path, this.getAllPosts);
    this.router.post(this.path, this.createPost);
    this.router.get(`${this.path}/:id`, this.getPostById);
    this.router.patch(`${this.path}/:id`, this.patchPost);
    this.router.delete(`${this.path}/:id`, this.deletePost);
  }

  getAllPosts = (req: express.Request, res: express.Response) => {
    postModel.find().then((posts) => {
      res.send(posts);
    });
  };

  getPostById(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const id = req.params.id;
    postModel.findById(id).then((post) => {
      if (post) res.send(post);
      else next(new PostNotFoundException(id));
    });
  }

  createPost = (req: express.Request, res: express.Response) => {
    const post: Post = req.body;
    // an instance of a model is called a document
    const createdPost = new postModel(post);
    // using res.send defaults to a 200 OK
    createdPost.save().then((savedPost) => res.send(savedPost));
  };

  patchPost = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const post: Post = req.body;
    const id = req.params.id;
    postModel
      // new: true => to get the new modified version
      .findByIdAndUpdate(id, post, { new: true })
      .then((post) => {
        if (post) res.send(post);
        else next(new PostNotFoundException(id));
      });
  };

  deletePost = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const id = req.params.id;
    postModel
      // new: true => to get the new modified version
      .findByIdAndDelete(id)
      .then((success) => {
        if (success) res.send(200);
        else next(new PostNotFoundException(id));
      });
  };
}

export default PostsController;
