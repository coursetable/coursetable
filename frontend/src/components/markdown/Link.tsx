import { Link } from 'react-router-dom';

export default function MDLink({
  href,
  children,
  ...props
}: React.ComponentProps<'a'>) {
  // eslint-disable-next-line react/jsx-no-target-blank
  if (!href) return <a {...props}>{children}</a>;
  const absolute = new URL(href, 'https://coursetable.com');
  if (absolute.origin !== 'https://coursetable.com') {
    return (
      <a href={href} {...props} rel="noopener noreferrer" target="_blank">
        {children}
      </a>
    );
  }
  return <Link to={href}>{children}</Link>;
}
