"use client";
import { Generator } from "./Generator";
import "../globals.css";

export default function Generators() {
  return (
    <>
      <main className="min-h-screen overflow-hidden">
        <h1 className="text-white text-6xl font-semibold text-center pt-10">
          Playlist Generators
        </h1>
        <div className="flex flex-wrap justify-evenly items-center h-screen overflow-hidden">
          <Generator
            title={"Genre Explorer"}
            content={"Explore new music based on a given genre."}
            typeOfPlaylist={"Genre"}
          ></Generator>
          <Generator
            title={"Song Roulette"}
            content={
              "Enter a song you love, and the generator will craft a playlist around it."
            }
            typeOfPlaylist={"Song"}
          ></Generator>
          <Generator
            title={"Artist Spotlight"}
            content={
              "Pick an artist, and the generator will capture the essence and sound of your chosen artist."
            }
            typeOfPlaylist={"Artist"}
          ></Generator>
        </div>
      </main>
    </>
  );
}
