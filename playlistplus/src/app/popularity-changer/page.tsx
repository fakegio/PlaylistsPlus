"use client"
import Image from 'next/image'
import { useEffect, useState } from 'react'
import React from 'react'
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownSection, DropdownItem } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { removeCredentials } from '@/API/authorize';
import PopularityRange from './popularity-range';

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
      <PopularityRange />
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
      </div>
    </main>
  )
}