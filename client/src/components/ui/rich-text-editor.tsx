import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bold, Italic, List, ListOrdered, Link, Quote } from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const [editorContent, setEditorContent] = useState(content);

  useEffect(() => {
    setEditorContent(content);
  }, [content]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setEditorContent(newContent);
    onChange(newContent);
  };

  const insertMarkdown = (prefix: string, suffix: string = "") => {
    const textarea = document.getElementById("editor-textarea") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = editorContent.substring(start, end);
    const newText = `${prefix}${selectedText}${suffix}`;
    
    const newContent = 
      editorContent.substring(0, start) + 
      newText + 
      editorContent.substring(end);
    
    setEditorContent(newContent);
    onChange(newContent);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 0);
  };

  const formatButtons = [
    { icon: Bold, action: () => insertMarkdown("**", "**"), tooltip: "Negrito" },
    { icon: Italic, action: () => insertMarkdown("*", "*"), tooltip: "Itálico" },
    { icon: List, action: () => insertMarkdown("- "), tooltip: "Lista" },
    { icon: ListOrdered, action: () => insertMarkdown("1. "), tooltip: "Lista Numerada" },
    { icon: Quote, action: () => insertMarkdown("> "), tooltip: "Citação" },
    { icon: Link, action: () => insertMarkdown("[", "](https://exemplo.com)"), tooltip: "Link" },
  ];

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex gap-1">
        {formatButtons.map((button, index) => (
          <Button
            key={index}
            type="button"
            variant="ghost"
            size="sm"
            onClick={button.action}
            title={button.tooltip}
            className="h-8 w-8 p-0"
          >
            <button.icon className="h-4 w-4" />
          </Button>
        ))}
      </div>

      {/* Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[300px]">
        <div className="border-r border-gray-300">
          <textarea
            id="editor-textarea"
            value={editorContent}
            onChange={handleContentChange}
            className="w-full h-full min-h-[300px] p-4 resize-none border-none outline-none"
            placeholder="Escreva o conteúdo do post aqui... Use Markdown para formatação."
          />
        </div>
        
        {/* Preview */}
        <div className="p-4 bg-gray-50 overflow-y-auto max-h-[300px]">
          <div className="prose prose-sm max-w-none">
            {editorContent ? (
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: editorContent
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/^- (.+)$/gm, '<li>$1</li>')
                    .replace(/^(\d+)\. (.+)$/gm, '<li>$1. $2</li>')
                    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
                    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
                    .replace(/\n/g, '<br />')
                }} 
              />
            ) : (
              <p className="text-gray-500 italic">Pré-visualização aparecerá aqui...</p>
            )}
          </div>
        </div>
      </div>

      {/* Help */}
      <div className="bg-gray-50 border-t border-gray-300 p-2 text-xs text-gray-600">
        <strong>Dicas de formatação:</strong> **negrito**, *itálico*, - lista, 1. lista numerada, {'>'} citação, [link](url)
      </div>
    </div>
  );
}
