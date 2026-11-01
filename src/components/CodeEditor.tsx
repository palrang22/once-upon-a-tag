import { useEffect, useRef, useState } from 'react';
import Editor, { loader, type OnMount } from '@monaco-editor/react';
import * as monaco from 'monaco-editor/editor/editor.api.js';
import 'monaco-editor/language/html/monaco.contribution.js';
import EditorWorker from 'monaco-editor/editor/editor.worker.js?worker';
import HtmlWorker from 'monaco-editor/language/html/html.worker.js?worker';
import type { LintIssue } from '../game/htmlLint';
import type { FileKind } from '../game/types';

self.MonacoEnvironment = {
  getWorker(_moduleId, label) {
    if (label === 'html' || label === 'handlebars' || label === 'razor') return new HtmlWorker();
    if (label === 'css' || label === 'scss' || label === 'less') return new EditorWorker();
    return new EditorWorker();
  },
};
loader.config({ monaco });

monaco.editor.defineTheme('ouat', {
  base: 'vs', inherit: true,
  rules: [
    { token: 'tag', foreground: '2F5DA8' },
    { token: 'metatag', foreground: '2F5DA8' },
    { token: 'attribute.name', foreground: '141414' },
    { token: 'attribute.value', foreground: '5E5E5E' },
    { token: 'comment', foreground: '8A8A8A' },
  ],
  colors: {
    'editor.background': '#FFFFFF', 'editor.foreground': '#141414',
    'editorLineNumber.foreground': '#8A8A8A', 'editorLineNumber.activeForeground': '#141414',
    'editor.lineHighlightBackground': '#EFEFEF', 'editorCursor.foreground': '#141414',
    'editor.selectionBackground': '#D9E3F2', 'editorGutter.background': '#FFFFFF',
  },
});

interface Props { value: string; onChange: (value: string) => void; file: FileKind; issues: LintIssue[]; onPosition: (line: number, column: number) => void }
export function CodeEditor({ value, onChange, file, issues, onPosition }: Props) {
  const editor = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [ready, setReady] = useState(false);
  const mount: OnMount = (instance) => {
    editor.current = instance;
    setReady(true);
    instance.onDidChangeCursorPosition(e => onPosition(e.position.lineNumber, e.position.column));
    document.fonts.ready.then(() => monaco.editor.remeasureFonts());
  };
  useEffect(() => {
    if (ready) editor.current?.setPosition({ lineNumber: 1, column: 1 });
  }, [file, ready]);
  useEffect(() => {
    const model = editor.current?.getModel();
    if (!ready || !model) return;
    monaco.editor.setModelMarkers(model, 'ouat-lint', issues.map(issue => ({
      startLineNumber: issue.line, startColumn: issue.column, endLineNumber: issue.line, endColumn: issue.column + issue.length,
      message: issue.message, severity: monaco.MarkerSeverity.Error,
    })));
  }, [issues, ready]);
  return <div className="editor-area">
    <Editor
      path={`file:///index.${file}`} language={file === 'html' ? 'html' : file === 'css' ? 'css' : 'javascript'}
      value={value} onChange={v => onChange(v ?? '')} onMount={mount} theme="ouat"
      loading={<span className="editor-loading">에디터 여는 중…</span>}
      options={{ fontFamily: 'Monatendard, monospace', fontSize: 16, lineHeight: 30,
        minimap: { enabled: false }, scrollBeyondLastLine: false, wordWrap: 'on', automaticLayout: true,
        padding: { top: 16, bottom: 16 }, glyphMargin: false, lineNumbersMinChars: 3,
        renderLineHighlight: 'all', tabSize: 2, overviewRulerLanes: 0, editContext: false }}
    />
  </div>;
}
