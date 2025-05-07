import { Toaster } from "react-hot-toast";

export default function CaptureLayout({ children }) {
  return (
    <div className="min-h-screen bg-black">
      {children}
      <Toaster position="bottom-center" />  
    </div>
  );
} 