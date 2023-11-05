// add a prop that is the label and placeholder
export function Search({ typeOfPlaylist }: { typeOfPlaylist: string }) {
  return (
    <>
      <label htmlFor="search-form">{typeOfPlaylist}</label>
      <form action="#" name="search-form" className="flex flex-col gap-3">
        <input
          className="bg-white rounded-md"
          type="text"
          name="text"
          id="text"
          placeholder={"Search " + typeOfPlaylist + "s..."}
        />
        <label htmlFor={typeOfPlaylist}>
          {" "}
          <input
            className="mr-2 form-checkbox text-white"
            type="checkbox"
            name={typeOfPlaylist}
            id={typeOfPlaylist}
          />
          Utilize listening patterns
        </label>
        <button
          className="bg-green-500 rounded-lg px-4 py-2 font-bold"
          type="submit"
        >
          Create Playlist
        </button>
      </form>
    </>
  );
}
