'use client'
export default function PrimaryButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="bg-clicalo-amarillo hover:bg-clicalo-amarilloHover text-clicalo-azul font-semibold py-3 px-6 rounded-full text-lg transition"
    >
      {children}
    </button>
  );
}