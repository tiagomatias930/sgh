import { Button } from "@/components/ui/button";
import { Calendar, Phone } from "lucide-react";

export default function Hero() {
  return (
    <section 
      id="inicio" 
      className="relative bg-gradient-to-r from-blue-600 to-blue-400 text-white py-20"
      style={{
        backgroundImage: "url('https://raw.githubusercontent.com/tiagomatias930/sgh/main/Design%20sem%20nome.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "overlay"
      }}
    >
      <div className="absolute inset-0 bg-blue-600 bg-opacity-50"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Cuidados de Saúde Especializados para Crianças
            </h1>
            <p className="text-xl mb-8 opacity-90">
              O Hospital Pediátrico de Luanda oferece cuidados médicos de excelência para crianças e adolescentes, com uma equipa médica altamente qualificada e tecnologia de ponta.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-white text-blue-600 hover:bg-blue-100 px-8 py-3 text-lg">
                <Calendar className="mr-2 h-5 w-5" />
                Marcar Consulta
              </Button>
              <Button 
                variant="outline" 
                className="border-2 border-white bg-transparent text-white-600 hover:bg-white hover:text-blue-600 transition-colors px-8 py-3 text-lg"
              >
                <Phone className="mr-2 h-5 w-5" />
                Urgências: 24/7
              </Button>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
