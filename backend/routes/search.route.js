import express from "express";

import {
  getSearchHistory,
  removeItemFromSearchHistory,
  searchMovie,
  searchPerson,
  searchTv,
} from "../controllers/search.controller.js";

const searchRoutes = express.Router();

searchRoutes.get("/person/:query", searchPerson);
searchRoutes.get("/movie/:query", searchMovie);
searchRoutes.get("/tv/:query", searchTv);

searchRoutes.get("/history", getSearchHistory);

searchRoutes.delete("/history/:id", removeItemFromSearchHistory);

export default searchRoutes;
