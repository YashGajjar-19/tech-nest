import Link from "next/link";
import { Container } from "./Container";

export function Footer() {
  return (
    <footer className="border-t bg-background/50 backdrop-blur-sm mt-auto">
      <Container>
        <div className="flex flex-col gap-8 py-10 md:py-16">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
            <div className="col-span-2 lg:col-span-2">
              <Link href="/" className="flex items-center space-x-2 mb-6">
                <span className="font-bold text-xl tracking-tight text-text-primary/90">
                  Tech Nest
                </span>
              </Link>
              <p className="text-sm font-medium text-text-primary/40 mb-4 max-w-xs leading-relaxed">
                The intelligent interface for understanding technology.
              </p>
            </div>

            <div>
              <h3 className="text-[13px] uppercase tracking-wider font-bold mb-5 text-text-primary/70">
                Product
              </h3>
              <ul className="space-y-4 text-[14px] font-medium text-text-primary/50">
                <li>
                  <Link
                    href="/devices"
                    className="hover:text-text-secondary transition-colors"
                  >
                    Devices
                  </Link>
                </li>
                <li>
                  <Link
                    href="/compare"
                    className="hover:text-text-secondary transition-colors"
                  >
                    Compare
                  </Link>
                </li>
                <li>
                  <Link
                    href="/discovery"
                    className="hover:text-text-secondary transition-colors"
                  >
                    AI Discovery
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-[13px] uppercase tracking-wider font-bold mb-5 text-text-primary/70">
                Company
              </h3>
              <ul className="space-y-4 text-[14px] font-medium text-text-primary/50">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-text-secondary transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/vision"
                    className="hover:text-text-secondary transition-colors"
                  >
                    Vision
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-text-secondary transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-[13px] uppercase tracking-wider font-bold mb-5 text-text-primary/70">
                Legal
              </h3>
              <ul className="space-y-4 text-[14px] font-medium text-text-primary/50">
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-text-secondary transition-colors"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-text-secondary transition-colors"
                  >
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border-subtle text-[13px] font-medium text-text-primary/40">
            <p>© {new Date().getFullYear()} Tech Nest. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500"></span> All
                systems operational
              </span>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
