
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Post } from "@shared/schema";

interface NewsModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function NewsModal({ post, isOpen, onClose }: NewsModalProps) {
  if (!post) return null;

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

  const formatContent = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Badge className={getCategoryColor(post.category)}>
                  {getCategoryLabel(post.category)}
                </Badge>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="mr-1 h-4 w-4" />
                  <span>{new Date(post.createdAt!).toLocaleDateString("pt-PT")}</span>
                </div>
              </div>
              <DialogTitle className="text-2xl font-bold text-gray-900 leading-tight">
                {post.title}
              </DialogTitle>
              <DialogDescription className="sr-only">
                {post.excerpt}
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="flex-shrink-0 ml-4"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="mt-6">
          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
          )}
          
          <div className="prose prose-lg max-w-none">
            <div
              className="text-gray-700 leading-relaxed text-lg"
              dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
