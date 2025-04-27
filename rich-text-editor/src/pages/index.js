import dynamic from 'next/dynamic';

// this allows to load the componenet only when it is needed and on the client side.
// server-side-rendering is disabled.
const Editor = dynamic(() => import("../components/Editor"), { ssr: false });

export default function Home() {
  return (
    <main style={{ padding: '20px' }}>
      <h1>📝 Rich Text Editor</h1>
      <Editor />
    </main>
  );
}
