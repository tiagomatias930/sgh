import { Hospital, MapPin, Phone, Mail, Facebook, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <img src="https://raw.githubusercontent.com/tiagomatias930/sgh/main/transferir__1_-removebg-preview.png" alt="logoHospital" className="mr-2 h-8 w-8" />
              Hospital Pediátrico de Luanda
            </h3>
            <p className="text-gray-400 mb-4">
              Cuidados de saúde especializados para crianças e adolescentes com excelência e dedicação.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Links Úteis</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button 
                  onClick={() => scrollToSection("inicio")}
                  className="hover:text-white transition-colors"
                >
                  Início
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("sobre")}
                  className="hover:text-white transition-colors"
                >
                  Sobre Nós
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("servicos")}
                  className="hover:text-white transition-colors"
                >
                  Serviços
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("noticias")}
                  className="hover:text-white transition-colors"
                >
                  Notícias
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Serviços</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Consultas</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Urgências</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cirurgia</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Internamento</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center">
                <Phone className="mr-2 h-4 w-4" />
                +244 900 000 000
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 h-4 w-4" />
                info@hospitalpediatricoluanda.ao
              </li>
              <li className="flex items-start">
                <MapPin className="mr-2 h-4 w-4 mt-1 flex-shrink-0" />
                Rua Principal, Bairro da Saúde, Luanda
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Hospital Pediátrico de Luanda David Bernadino. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
