import React, { useState } from "react";
import {
  Carousel, // our UI Component to display the results
} from "@giphy/react-components";
import { GiphyFetch } from "@giphy/js-fetch-api";

const giphyFetch = new GiphyFetch("lRW73c5GgjKoZUKlta1yXYVl1GvlyJSq");

export const GiphyCarousel = ({
  gifSearch,
  sendGif,
  setOpenGiphy,
  setGifSearch,
}) => {
  const fetchGifs = (offset) =>
    giphyFetch.search(gifSearch ? gifSearch : "cats", { offset, limit: 10 });
  return (
    <div style={{ backgroundColor: "white" }}>
      <Carousel
        fetchGifs={fetchGifs}
        gifHeight={200}
        gutter={2}
        noLink={true}
        key={gifSearch}
        hideAttribution={true}
        onGifClick={(e) => {
          sendGif(e.images.original.url);
          setOpenGiphy(false);
          setGifSearch("");
        }}
      />
    </div>
  );
};
