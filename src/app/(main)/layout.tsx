import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/navbar/Navbar";

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex min-h-screen flex-col bg-linear-to-br from-blue-800/15 via-zinc-950 via-20% to-zinc-950">
            <Navbar />
            <main className="flex grow flex-col">{children}</main>
            <Footer />
        </div>
    );
}
