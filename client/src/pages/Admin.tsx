
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import RichTextEditor from "@/components/ui/rich-text-editor";
import ImageUpload from "@/components/ui/image-upload";
import type { Post } from "@shared/schema";
import { Edit, Trash2, Plus, FileText, CheckCircle, BarChart3 } from "lucide-react";

export default function Admin() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [postForm, setPostForm] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "",
    imageUrl: "",
    published: true,
  });

  const { data: posts = [], isLoading: postsLoading } = useQuery<Post[]>({
    queryKey: ["/api/admin/posts"],
    enabled: isAuthenticated,
    retry: false,
  });

  const verifyPasswordMutation = useMutation({
    mutationFn: async (password: string) => {
      const response = await apiRequest("POST", "/api/admin/verify", { password });
      return response;
    },
    onSuccess: () => {
      setIsAuthenticated(true);
      toast({
        title: "Acesso autorizado",
        description: "Bem-vindo ao painel administrativo!",
      });
    },
    onError: () => {
      toast({
        title: "Senha incorreta",
        description: "Por favor, tente novamente.",
        variant: "destructive",
      });
    },
  });

  const createPostMutation = useMutation({
    mutationFn: async (postData: any) => {
      await apiRequest("POST", "/api/posts", postData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      toast({
        title: "Post criado",
        description: "O post foi criado com sucesso.",
      });
      setIsCreateModalOpen(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao criar post. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      await apiRequest("PUT", `/api/posts/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      toast({
        title: "Post atualizado",
        description: "O post foi atualizado com sucesso.",
      });
      setEditingPost(null);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar post. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/posts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      toast({
        title: "Post eliminado",
        description: "O post foi eliminado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao eliminar",
        description: "Não foi possível eliminar o post. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password) {
      verifyPasswordMutation.mutate(password);
    }
  };

  const resetForm = () => {
    setPostForm({
      title: "",
      content: "",
      excerpt: "",
      category: "",
      imageUrl: "",
      published: true,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!postForm.title || !postForm.content || !postForm.excerpt || !postForm.category) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (editingPost) {
      updatePostMutation.mutate({ id: editingPost.id, data: postForm });
    } else {
      createPostMutation.mutate(postForm);
    }
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setPostForm({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      category: post.category,
      imageUrl: post.imageUrl || "",
      published: post.published,
    });
    setIsCreateModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja eliminar este post? Esta ação não pode ser desfeita.")) {
      deletePostMutation.mutate(id);
    }
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

  // Show password form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Acesso Administrativo</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Senha de Acesso</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite a senha"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-medical-blue hover:bg-blue-700"
                disabled={verifyPasswordMutation.isPending}
              >
                {verifyPasswordMutation.isPending ? "Verificando..." : "Entrar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const publishedPosts = Array.isArray(posts) ? posts.filter((post: Post) => post.published) : [];
  const draftPosts = Array.isArray(posts) ? posts.filter((post: Post) => !post.published) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-medical-blue text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center">
            <BarChart3 className="mr-2" />
            Painel Administrativo
          </h1>
          <Button 
            variant="secondary" 
            onClick={() => setIsAuthenticated(false)}
          >
            Sair
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total de Posts</p>
                  <p className="text-2xl font-bold text-medical-blue">{Array.isArray(posts) ? posts.length : 0}</p>
                </div>
                <div className="bg-medical-blue/10 p-3 rounded-lg">
                  <FileText className="text-medical-blue" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Posts Publicados</p>
                  <p className="text-2xl font-bold text-success-green">{publishedPosts.length}</p>
                </div>
                <div className="bg-success-green/10 p-3 rounded-lg">
                  <CheckCircle className="text-success-green" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Rascunhos</p>
                  <p className="text-2xl font-bold text-orange-500">{draftPosts.length}</p>
                </div>
                <div className="bg-orange-500/10 p-3 rounded-lg">
                  <Edit className="text-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Posts Management */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Gerir Posts</CardTitle>
              <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-medical-blue hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Post
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" aria-describedby="post-form-description">
                  <DialogHeader>
                    <DialogTitle>
                      {editingPost ? "Editar Post" : "Criar Novo Post"}
                    </DialogTitle>
                  </DialogHeader>
                  <p id="post-form-description" className="sr-only">
                    Formulário para {editingPost ? "editar um post existente" : "criar um novo post"}. Preencha todos os campos obrigatórios.
                  </p>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="title">Título *</Label>
                      <Input
                        id="title"
                        value={postForm.title}
                        onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                        placeholder="Título do post"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="category">Categoria *</Label>
                      <Select 
                        value={postForm.category} 
                        onValueChange={(value) => setPostForm({ ...postForm, category: value })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="campanha">Campanha</SelectItem>
                          <SelectItem value="tecnologia">Tecnologia</SelectItem>
                          <SelectItem value="evento">Evento</SelectItem>
                          <SelectItem value="noticia">Notícia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <ImageUpload
                        onImageUpload={(imageUrl) => setPostForm({ ...postForm, imageUrl })}
                        currentImageUrl={postForm.imageUrl}
                      />
                    </div>

                    <div>
                      <Label htmlFor="excerpt">Resumo *</Label>
                      <Input
                        id="excerpt"
                        value={postForm.excerpt}
                        onChange={(e) => setPostForm({ ...postForm, excerpt: e.target.value })}
                        placeholder="Breve descrição do post"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="content">Conteúdo *</Label>
                      <RichTextEditor
                        content={postForm.content}
                        onChange={(content) => setPostForm({ ...postForm, content })}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="published"
                        checked={postForm.published}
                        onChange={(e) => setPostForm({ ...postForm, published: e.target.checked })}
                        className="rounded"
                      />
                      <Label htmlFor="published">Publicar imediatamente</Label>
                    </div>

                    <div className="flex justify-end space-x-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setIsCreateModalOpen(false);
                          setEditingPost(null);
                          resetForm();
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button 
                        type="submit" 
                        className="bg-medical-blue hover:bg-blue-700"
                        disabled={createPostMutation.isPending || updatePostMutation.isPending}
                      >
                        {createPostMutation.isPending || updatePostMutation.isPending ? "A guardar..." : editingPost ? "Atualizar" : "Criar"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {postsLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-blue"></div>
              </div>
            ) : Array.isArray(posts) && posts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Título</th>
                      <th className="text-left py-3 px-4 font-semibold">Categoria</th>
                      <th className="text-left py-3 px-4 font-semibold">Estado</th>
                      <th className="text-left py-3 px-4 font-semibold">Data</th>
                      <th className="text-left py-3 px-4 font-semibold">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(posts) && posts.map((post: Post) => (
                      <tr key={post.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{post.title}</td>
                        <td className="py-3 px-4">
                          <Badge className={getCategoryColor(post.category)}>
                            {getCategoryLabel(post.category)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={post.published ? "default" : "secondary"}>
                            {post.published ? "Publicado" : "Rascunho"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {new Date(post.createdAt!).toLocaleDateString("pt-PT")}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(post)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(post.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>Nenhum post encontrado</p>
                <p className="text-sm">Crie o seu primeiro post para começar</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
