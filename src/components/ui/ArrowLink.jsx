import { ArrowUpRight } from 'lucide-react';
export default function ArrowLink({ href, children, external = false, className = '' }) {
  return <a className={`underlined-link ${className}`} href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}>{children}<ArrowUpRight size={17} /></a>;
}
