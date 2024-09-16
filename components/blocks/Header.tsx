"use client";

import { Link } from "@nextui-org/link";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@nextui-org/navbar";
import { Anton } from "next/font/google";
import Image from "next/image";
import { useState } from "react";

const anton = Anton({ weight: "400", subsets: ["latin"] });

function Logo() {
  return (
    <Link
      href="/"
      className={`${anton.className} text-4xl uppercase text-white flex gap-4 items-center`}
    >
      <Image
        src="/images/cathead.png"
        width={42}
        height={42}
        alt="A Cat's Head"
      />
      <span>FAUX FETUS</span>
    </Link>
  );
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarBrand>
          <Logo />
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem className="hidden sm:flex sm:gap-4">
          <Link href="/contact">Contact</Link>
        </NavbarItem>

        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden text-white"
        />
      </NavbarContent>

      <NavbarMenu className={anton.className}>
        <NavbarMenuItem className="text-right">
          <Link className="text-white uppercase text-2xl" href="/contact">
            Contact
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
