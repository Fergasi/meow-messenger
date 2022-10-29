import React, { useContext } from "react";
import {
  Carousel, // our UI Component to display the results
  SearchBar, // the search bar the user will type into
  SearchContext, // the context that wraps and connects our components
  SearchContextManager, // the context manager, includes the Context.Provider
  SearchBarComponent, // an optional UI component that displays trending searches and channel / username results
  SuggestionBar,
} from "@giphy/react-components";
import { GiphyFetch } from "@giphy/js-fetch-api";

const giphyFetch = new GiphyFetch("lRW73c5GgjKoZUKlta1yXYVl1GvlyJSq");

export const GiphyCarousel = () => {
  const fetchGifs = (offset) =>
    giphyFetch.search("dogs", { offset, limit: 10 });
  return (
    <>
      <Carousel fetchGifs={fetchGifs} gifHeight={200} gutter={2} />
    </>
  );
};
