// /components/Header.js
export default function Header() {
  return (
    <header className="bg-gray-800 text-white">
      <nav className="container mx-auto p-4 flex justify-between">
        <div className="text-2xl">Logo</div>
        <ul className="flex space-x-4">
          <li>Home</li>
          <li>Features</li>
          <li>Contact</li>
        </ul>
      </nav>
    </header>
  );
}
