"use client";
import { useEffect } from "react";

export default function PlaylistResults() {
  if (typeof window !== "undefined") {
    console.log(localStorage.getItem("filteredPlaylistResults"));
  }
  return <h1 className="text-blue-600">hello</h1>;
}
