'use client';
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";

import { cn } from "@/lib/utils";
import {createTheme, ThemeProvider, CssBaseline, Container} from "@mui/material";

const theme = createTheme({
  palette: {
    mode: 'dark'
  }
});

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
      <ThemeProvider theme={theme}>
        <CssBaseline />
          <Container maxWidth={"xl"}>
            {children}
          </Container>
      </ThemeProvider>
      </body>
    </html>
  );
}
