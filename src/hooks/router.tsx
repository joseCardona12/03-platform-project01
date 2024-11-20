import { usePathname, useSearchParams, useRouter as useNextRouter } from 'next/navigation';

export default function useCustomRouter() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const nextRouter = useNextRouter();

  return {
    pathname,
    searchParams,
    navigate: (url: string | URL) => {
      nextRouter.push(url.toString()); // Convierte URL a string si es necesario
    },
  };
}
