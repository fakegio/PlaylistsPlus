"use client"
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'

const port = 3000

function getQueryParam(param : string) {
    const searchParams = useSearchParams()
   
    const search = searchParams.get(param)
   
    // URL -> `/dashboard?search=my-project`
    // `search` -> 'my-project'
    return <>{search}</>
  }


  export default function Home() {
    var code = getQueryParam('code')
    var state = getQueryParam('state')
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: process.env.REDIRECT_URI,
                grant_type: 'authorization_code'
            },
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + (new Buffer(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64'))
            },
             json: true
        }
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
        <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        </div>
      </main>
    )
  }