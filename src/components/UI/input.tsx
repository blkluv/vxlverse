export function Input(props: JSX.IntrinsicElements["input"]) {
  return (
    <input
      onKeyDown={(e) => {
        e.stopPropagation();
      }}
      onKeyUp={(e) => {
        e.stopPropagation();
      }}
      onKeyPress={(e) => {
        e.stopPropagation();
      }}
      onClick={(e) => {
        e.stopPropagation();
      }}
      {...props}
    />
  );
}
