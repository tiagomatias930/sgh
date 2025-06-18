import { Card, CardContent } from "@/components/ui/card";
import { Stethoscope, Ambulance, UserRound, X, Microscope, Bed, Check } from "lucide-react";

export default function ServicesSection() {
  const services = [
    {
      icon: Stethoscope,
      title: "Consultas Especializadas",
      description: "Pediatria geral, cardiologia pediátrica, neurologia, endocrinologia e outras especialidades.",
      color: "bg-medical-blue",
      features: [
        "Consultas de rotina",
        "Seguimento de doenças crónicas",
        "Segunda opinião médica"
      ]
    },
    {
      icon: Ambulance,
      title: "Urgências Pediátricas",
      description: "Atendimento de urgência 24 horas por dia, 7 dias por semana, com equipa especializada.",
      color: "bg-red-500",
      features: [
        "Triagem rápida",
        "Observação contínua",
        "Estabilização imediata"
      ]
    },
    {
      icon: UserRound,
      title: "Cirurgia Pediátrica",
      description: "Cirurgias especializadas com técnicas minimamente invasivas e cuidados pós-operatórios dedicados.",
      color: "bg-success-green",
      features: [
        "Cirurgia geral pediátrica",
        "Ortopedia infantil",
        "Procedimentos ambulatórios"
      ]
    },
    {
      icon: X,
      title: "Imagiologia",
      description: "Exames de diagnóstico por imagem com equipamentos modernos adaptados para crianças.",
      color: "bg-purple-500",
      features: [
        "Radiografias",
        "Ecografias",
        "Tomografias"
      ]
    },
    {
      icon: Microscope,
      title: "Laboratório",
      description: "Análises clínicas com resultados rápidos e precisos para diagnósticos eficazes.",
      color: "bg-orange-500",
      features: [
        "Análises sanguíneas",
        "Microbiologia",
        "Testes rápidos"
      ]
    },
    {
      icon: Bed,
      title: "Internamento",
      description: "Quartos confortáveis e seguros com acompanhamento médico 24 horas e apoio familiar.",
      color: "bg-light-blue",
      features: [
        "Quartos individuais",
        "Acompanhamento parental",
        "Atividades lúdicas"
      ]
    }
  ];

  return (
    <section id="servicos" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Nossos Serviços</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Oferecemos uma gama completa de serviços médicos especializados para crianças e adolescentes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="hover:shadow-xl transition-shadow border border-gray-100">
              <CardContent className="p-8">
                <div className={`${service.color} text-white w-16 h-16 rounded-full flex items-center justify-center mb-6`}>
                  <service.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-4">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                      <Check className="h-4 w-4 text-success-green mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
