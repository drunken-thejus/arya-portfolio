"use client";

import { useEffect } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";

import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Label } from "./ui";

function ToolbarButton({
  active,
  onClick,
  children,
  title,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={cn(
        "min-w-8 rounded px-2 py-1 text-sm transition-colors",
        active ? "bg-accent text-ink" : "text-bone-dim hover:bg-ink hover:text-bone"
      )}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const addLink = () => {
    const url = window.prompt("Link URL");
    if (url) editor.chain().focus().setLink({ href: url }).run();
    else editor.chain().focus().unsetLink().run();
  };

  const addImage = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const { url } = await api.uploadFile(file, "media");
        const { resolveImage } = await import("@/lib/utils");
        editor.chain().focus().setImage({ src: resolveImage(url) ?? url }).run();
      } catch {
        window.alert("Image upload failed");
      }
    };
    input.click();
  };

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-line p-2">
      <ToolbarButton title="Heading 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        H2
      </ToolbarButton>
      <ToolbarButton title="Heading 3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
        H3
      </ToolbarButton>
      <span className="mx-1 h-5 w-px bg-line" />
      <ToolbarButton title="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
        <strong>B</strong>
      </ToolbarButton>
      <ToolbarButton title="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <em>I</em>
      </ToolbarButton>
      <span className="mx-1 h-5 w-px bg-line" />
      <ToolbarButton title="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        • List
      </ToolbarButton>
      <ToolbarButton title="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        1. List
      </ToolbarButton>
      <ToolbarButton title="Quote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        ❝
      </ToolbarButton>
      <span className="mx-1 h-5 w-px bg-line" />
      <ToolbarButton title="Link" active={editor.isActive("link")} onClick={addLink}>
        Link
      </ToolbarButton>
      <ToolbarButton title="Image" onClick={addImage}>
        Image
      </ToolbarButton>
    </div>
  );
}

export default function RichTextEditor({
  value,
  onChange,
  label = "Content",
}: {
  value: string;
  onChange: (html: string) => void;
  label?: string;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
      Placeholder.configure({ placeholder: "Write your article…" }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "prose-editorial min-h-[280px] px-4 py-4 focus:outline-none",
      },
    },
  });

  // Sync external value changes (e.g. when editing a different record)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, value]);

  return (
    <div>
      <Label>{label}</Label>
      <div className="overflow-hidden rounded-lg border border-line bg-ink">
        {editor && <Toolbar editor={editor} />}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
