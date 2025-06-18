import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight, FileText } from "lucide-react";
import NewsModal from "@/components/NewsModal";
import type { Post } from "@shared/schema";

export default function NewsSection() {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: posts, isLoading } = useQuery({
    queryKey: ["/api/posts"],
    retry: false,
  });

  const openNewsModal = (post: Post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const closeNewsModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "campanha": return "bg-medical-blue text-white";
      case "tecnologia": return "bg-success-green text-white";
      case "evento": return "bg-purple-500 text-white";
      case "noticia": return "bg-orange-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "campanha": return "Campanha";
      case "tecnologia": return "Tecnologia";
      case "evento": return "Evento";
      case "noticia": return "Notícia";
      default: return category;
    }
  };

  return (
    <section id="noticias" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Notícias e Atualizações</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Mantenha-se informado sobre as últimas novidades, campanhas de saúde e eventos do nosso hospital.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-blue"></div>
          </div>
        ) : posts && posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {posts.slice(0, 6).map((post: Post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative">
                    {post.imageUrl ? (
                      <img 
                        src={post.imageUrl} 
                        alt={post.title}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-medical-blue to-light-blue flex items-center justify-center">
                        <FileText className="h-12 w-12 text-white opacity-50" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <Badge className={getCategoryColor(post.category)}>
                        {getCategoryLabel(post.category)}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>{new Date(post.createdAt!).toLocaleDateString("pt-PT")}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <Button 
                      variant="link" 
                      className="text-medical-blue hover:text-blue-700 p-0"
                      onClick={() => openNewsModal(post)}
                    >
                      Ler mais <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button className="bg-medical-blue hover:bg-blue-700 px-8 py-3">
                Ver Todas as Notícias
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma notícia disponível</h3>
            <p className="text-gray-600">
              Não há notícias publicadas no momento. Volte em breve para ver as últimas atualizações.
            </p>
          </div>
        )}

        <NewsModal
          post={selectedPost}
          isOpen={isModalOpen}
          onClose={closeNewsModal}
        />
      </div>
    </section>
  );
}
