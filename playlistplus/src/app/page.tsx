import Image from 'next/image'
import { useRouter } from 'next/navigation';

export default function Home() {
  const CLIENT_ID="463e8cd3eb06493faf19f84a0afab027"
  const REDIRECT_URI="http://localhost:3000/"
  const CLIENT_SECRET="172deb1fdd504a60b84b2efd70c7a5f1"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"
  
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
              src="/gotospotify.svg"
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
          src="/Playlist+.svg"
          alt="Playlist+ Logo"
          width={380}
          height={37}
          priority
        />
      </div>

      
      <div className="Log in button">
        <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user-read-private%20user-read-email&response_type=${RESPONSE_TYPE}&state=state&show_dialog=true`}>
        <Image
          className="relative dark: dark"
          src="/signin.svg"
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