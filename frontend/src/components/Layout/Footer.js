export default function Footer() {
  return (
    <footer className="w-full bg-gray-100 text-center py-3 text-sm text-gray-600">
      © {new Date().getFullYear()} Task Manager. All rights reserved.
    </footer>
  );
}
