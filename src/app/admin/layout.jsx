import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";
export default function NavbarLayout({ children }) {
    return (
      <>
        <Navbar />
        {children}
        <Toaster position="bottom-center" />
      </>
    );
  } 