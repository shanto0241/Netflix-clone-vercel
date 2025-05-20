import { fetchFromTMDB } from "../services/tmdb.service.js";

export async function getTrendingMovie(req, res) {
  try {
    const data = await fetchFromTMDB(
      "https://api.themoviedb.org/3/trending/movie/day?language=en-US"
    );
    const randomMovie =
      data.results[Math.floor(Math.random() * data.results?.length)];

    res.json({ success: true, content: randomMovie });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error in Service Page",
    });
  }
}

export async function getMovieTrailers(req, res) {
  const { id } = req.params;
  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`
    );
    res.json({
      success: true,
      trailers: data.results,
      message: "Trailer Fetched Successfully",
    });
  } catch (error) {
    if (error.message.includes("404")) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Movie not found",
        })
        .send(null);
    }
    console.error("Error in Get Movie Trailers :", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function getMovieDetails(req, res) {
  const { id } = req.params;
  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/movie/${id}?language=en-US`
    );
    res.status(200).json({
      success: true,
      content: data,
      message: "Movie Details Fetched Successfully",
    });
  } catch (error) {
    if (error.message.includes("404")) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Movie not found",
        })
        .send(null);
    }
    console.error("Error in Get Movie Details :", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function getSimilarMovies(req, res) {
  const { id } = req.params;
  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/movie/${id}/similar?language=en-US`
    );
    res.status(200).json({
      success: true,
      similar: data.results,
      message: "Similar Movies Fetched Successfully",
    });
  } catch (error) {
    if (error.message.includes("404")) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Movie not found",
        })
        .send(null);
    }
    console.error("Error in getTrendingMovie:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function getMoviesByCategory(req, res) {
  const { category } = req.params;
  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/movie/${category}?language=en-US`
    );
    res.status(200).json({
      success: true,
      content: data.results,
      message: "Movie category Fetched Successfully",
    });
  } catch (error) {
    if (error.message.includes("404")) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Movie category not found",
        })
        .send(null);
    }
    console.error("Error in getTrendingMovie:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
