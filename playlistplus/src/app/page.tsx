import Image from 'next/image'
import Waves from '../../components/waves'



async function getProfile(accessToken: string) {
  const response = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: 'Bearer ' + accessToken
    }
  });

  const data = await response.json();
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="">
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://play.spotify.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            {' '}
            <Image
              src="/images/gotospotify.svg"
              alt="Go To Spotify"
              className="dark"
              width={200}
              height={14}
              priority
            />
          </a>
        </div>
      </div>

      <div className="Playlists+">
        <Image
          className="relative dark: dark"
          src="/images/Playlist+.svg"
          alt="Playlist+ Logo"
          width={380}
          height={37}
          priority
        />
      </div>

      
      <div className="Log in button">
        <a href={`https://accounts.spotify.com/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&scope=${process.env.SCOPE}&response_type=token&show_dialog=false`}>
        <Image
          className="relative dark: dark"
          src="/images//signin.svg"
          alt="Sign in Logo"
          width={380}
          height={37}
          priority
        />
        </a>
      </div>


      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
      </div>
    </main>
  )
}