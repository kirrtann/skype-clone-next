"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./sidebar/page";
import ChatComponent from "./message/page";


export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, []);

  return (<>
    <div className="flex">
      <Sidebar />

    <div><ChatComponent /></div>

    </div>
  </>
  );
}
