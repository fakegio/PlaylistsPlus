import Image from 'next/image'
import express from 'express'
import querystring from 'querystring'

const app = express()
const port = 3000

function generateRandomString(length: number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}


export default function Home() {
  var state = generateRandomString(16);
  var scope = 'user-read-private user-read-email';

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
        <a href={'https://accounts.spotify.com/authorize?' +
          querystring.stringify({
            response_type: 'code',
            client_id: process.env.CLIENT_ID,
            scope: scope,
            redirect_uri: process.env.REDIRECT_URI,
            state: state
          })}>
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