import { Router } from "express";
import { getWebsite } from "../controllers/website.controllers.js";


const websiteRouter = Router();

websiteRouter.route("/").get(getWebsite);

export default websiteRouter;