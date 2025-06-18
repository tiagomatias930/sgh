import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, ArrowLeft, User, FileText } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import type { Post } from "@shared/schema";

export default function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  
  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
    retry: false,
  });

  // Find the specific post by ID
  const post = Array.isArray(posts) ? posts.find((p: Post) => p.id === id) : null;

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-blue"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Notícia não encontrada</h1>
            <p className="text-gray-600 mb-8">
              A notícia que procura não existe ou foi removida.
            </p>
            <Link href="/noticias">
              <Button className="bg-medical-blue hover:bg-blue-700">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar às Notícias
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-medical-blue">Início</Link>
            <span>/</span>
            <Link href="/noticias" className="hover:text-medical-blue">Notícias</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{post.title}</span>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div className="p-8 pb-6">
              <div className="flex items-center justify-between mb-6">
                <Link href="/noticias">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar às Notícias
                  </Button>
                </Link>
                <Badge className={getCategoryColor(post.category)}>
                  {getCategoryLabel(post.category)}
                </Badge>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {post.title}
              </h1>
              
              <div className="flex items-center space-x-6 text-gray-600 mb-6">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>{new Date(post.createdAt!).toLocaleDateString("pt-PT", {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Hospital Pediátrico</span>
                </div>
              </div>

              {post.excerpt && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-lg text-gray-700 font-medium leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              )}
            </div>

            {/* Featured Image */}
            {post.imageUrl && (
              <div className="px-8 mb-6">
                <img 
                  src={post.imageUrl} 
                  alt={post.title}
                  className="w-full h-64 md:h-96 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Content */}
            <div className="px-8 pb-8">
              <div className="prose prose-lg max-w-none">
                <div 
                  className="text-gray-700 leading-relaxed whitespace-pre-wrap"
                  style={{ lineHeight: '1.8' }}
                >
                  {post.content}
                </div>
              </div>
            </div>
          </div>

          {/* Related Actions */}
          <div className="mt-8 flex justify-center">
            <Link href="/noticias">
              <Button variant="outline" className="px-8">
                Ver Mais Notícias
              </Button>
            </Link>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}