type Props = {
  name: string;
  className?: string;
  width?: number | string;
  height?: number | string;
};

export function Icon({name, className, width, height}: Props) {
  return (
    <svg className={className} width={width} height={height} aria-hidden="true">
      <use href={`#i-${name}`} />
    </svg>
  );
}
