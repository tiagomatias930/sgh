import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Hospital, Menu, Shield, LogOut } from "lucide-react";

interface NavigationProps {
  showAdmin?: boolean;
}

export default function Navigation({ showAdmin = false }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  const navItems = [
    { href: "#inicio", label: "Início" },
    { href: "#noticias", label: "Notícias" },
    { href: "#sobre", label: "Sobre Nós" },
    { href: "#servicos", label: "Serviços" },
    { href: "#contacto", label: "Contacto" },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-blue-600 flex items-center">
              <img src="https://raw.githubusercontent.com/tiagomatias930/sgh/main/transferir__1_-removebg-preview.png" alt="logoHospital" className="mr-2 h-9 w-9" />
                Hospital Pediátrico de Luanda
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollToSection(item.href.slice(1))}
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {item.label}
                </button>
              ))}
              
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-6">
                  {navItems.map((item) => (
                    <button
                      key={item.href}
                      onClick={() => scrollToSection(item.href.slice(1))}
                      className="text-left text-gray-600 hover:text-medical-blue px-3 py-2 rounded-md text-base font-medium transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                  {showAdmin ? (
                    <>
                      <Link href="/xadminx">
                        <Button className="w-full bg-medical-blue hover:bg-blue-700" onClick={() => setIsOpen(false)}>
                          <Shield className="mr-1 h-4 w-4" />
                          Admin
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => window.location.href = "/api/logout"}
                      >
                        <LogOut className="mr-1 h-4 w-4" />
                        Sair
                      </Button>
                    </>
                  ) : (
                    <Link href="/admin">
                      <Button 
                        className="w-full bg-medical-blue hover:bg-blue-700"
                        onClick={() => setIsOpen(false)}
                      >
                        <Shield className="mr-1 h-4 w-4" />
                        Admin
                      </Button>
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
