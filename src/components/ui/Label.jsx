export default function Label({ children, light = false }) {
  return <span className={`eyebrow ${light ? 'eyebrow-rust' : 'eyebrow-light'}`}>{children}</span>;
}
