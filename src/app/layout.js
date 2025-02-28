import "./globals.css";
import { Inter, Dancing_Script } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const dancingScript = Dancing_Script({ subsets: ['latin'], variable: '--font-dancing-script' });

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
};
export const metadata = {
  title: "Anota Ai Amigo",
  description: "O 'Anota Aí, Amigo!' é um aplicativo feito para substituir o caderninho de fiado tradicional, ajudando vendedores a registrar, controlar e cobrar os valores que os clientes devem. Com um sistema prático e seguro, o app permite cadastrar clientes, registrar compras fiadas e acompanhar pagamentos pendentes.",
  author: "Marcelo Capello",
  keywords: "anota ai amigo, caderninho de fiado, controle de vendas, gestão de clientes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br " className={` ${dancingScript.variable}`}>
      <head>
        <meta name="description" content={metadata.description} />
        <meta name="author" content={metadata.author} />
        <meta name="keywords" content={metadata.keywords} />
        <meta name="viewport" content={metadata.viewport} />
        <title>{metadata.title}</title>
      </head>
      <body className={`${inter.className} antialiased`}>
          {children}
      </body>
    </html>
  );
}