export function Spinner({ size = 18 }) {
  const style = {
    width: size,
    height: size,
    border: '3px solid rgba(255,255,255,0.18)',
    borderTopColor: '#7bdff2',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  }
  return <span style={style} aria-label="loading" />
}
