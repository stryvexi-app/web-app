"use client";

import Editor from "@monaco-editor/react";

type Props = {
  language: string;
  code: string;
  onLanguageChange: (language: string) => void;
  onCodeChange: (code: string) => void;
  disabled?: boolean;
};

export default function CodeEditor({
  language,
  code,
  onLanguageChange,
  onCodeChange,
  disabled = false,
}: Props) {
    
  return (
    <section className="mock-code-editor">
      <div className="mock-code-toolbar">
        <label htmlFor="coding-language">Language</label>
        <select
          id="coding-language"
          value={language}
          onChange={(event) => onLanguageChange(event.target.value)}
          disabled={disabled}
        >
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
        </select>
      </div>

      <Editor
        height="380px"
        language={language}
        theme="vs-dark"
        value={code}
        onChange={(value) => onCodeChange(value ?? "")}
        options={{
          readOnly: disabled,
          minimap: { enabled: false },
          fontSize: 14,
          automaticLayout: true,
          scrollBeyondLastLine: false,
          wordWrap: "on",
          tabSize: 2,
        }}
      />
    </section>
  );
}