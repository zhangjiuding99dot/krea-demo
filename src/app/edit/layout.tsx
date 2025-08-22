import { EditPageStoreProvider } from "./store";

export default function EditPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <EditPageStoreProvider>
      {children}
    </EditPageStoreProvider>
  );
}
