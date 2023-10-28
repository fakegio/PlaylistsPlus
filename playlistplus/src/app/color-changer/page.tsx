"use client"
import Image from 'next/image'
import { useEffect, useState } from 'react'
import React from 'react'
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownSection, DropdownItem } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { removeCredentials } from '@/API/authorize';
import ColorChanger from './ColorChanger';

export default function Home() {
  const [codeVerifier, setCodeVerifier] = useState('')
  useEffect(() => {
    setCodeVerifier(sessionStorage.getItem("code_verifier") || "")
    let token = sessionStorage.getItem("access_token")
    /* verify theres a token at all times except for login screen */
    if (!token) {
      window.location.href = "/"
    }
  }, [])


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ColorChanger />
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <Dropdown>
          <DropdownTrigger>
            <Button variant="solid" color="primary">
              <Image
                src="/images/profile.svg"
                alt="Go To Spotify"
                className="dark"
                width={350}
                height={14}
                priority
              />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions" color="primary">
            <DropdownItem key="new">
              <Button variant="solid" color="primary">
                Settings
              </Button>
            </DropdownItem>
            <DropdownItem key="Log Out" className="text-danger" color="danger">
              <Button variant="solid" color="primary" onClick={removeCredentials}>
                Log Out
              </Button>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <p className="">
        </p>
        <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
          <p className=""></p>
        </div>
        <div className="fixed top-0 left-1/2 transform -translate-x-1/2 flex items-center justify-center bg-transparent lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            target="_blank"
            rel="noopener noreferrer"
          >
            {' '}
            <Image
              src="/images/dashboard.svg"
              alt="Dashboard"
              className="dark"
              width={800}
              height={14}
              priority
            />
          </a>
        </div>

        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-transparent lg:static lg:h-auto lg:w-auto lg:bg-none">
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
              width={400}
              height={14}
              priority
            />
          </a>
        </div>
      </div>
    </main>
  )
}