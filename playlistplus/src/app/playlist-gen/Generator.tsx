import { Search } from "./Search";

export function Generator({
  title,
  content,
  typeOfPlaylist,
}: {
  title: string;
  content: string;
  typeOfPlaylist: string;
}) {
  return (
    <>
      <div className="bg-zinc-200 flex flex-col rounded-lg p-5 gap-2">
        <h1 className="font-semibold text-2xl text-center">{title}</h1>
        <p className="text-center max-w-xs">{content}</p>
        <Search typeOfPlaylist={typeOfPlaylist}></Search>
      </div>
    </>
  );
}
