interface RibbonBadgeProps {
  type: 'winner' | 'project' | 'devtool' | 'homelab' | 'contract' | 'in progress';
}

const RibbonBadge = ({ type }: RibbonBadgeProps) => {
  const getColors = () => {
    switch (type) {
      case 'winner':
        return { bg: '#F4B400', text: '#8B6914', label: 'WINNER' };
      case 'in progress':
        return { bg: '#4ade80', text: '#14532d', label: 'IN PROGRESS' };
      case 'project':
        return { bg: '#f5f2ed', text: '#1a1f1c', label: 'PROJECT' };
      case 'devtool':
        return { bg: '#0891B2', text: '#164E63', label: 'DEVTOOL' };
      case 'homelab':
        return { bg: '#0891B2', text: '#164E63', label: 'HOMELAB' };
      case 'contract':
        return { bg: '#0891B2', text: '#164E63', label: 'CLIENT' };
      default:
        return { bg: '#0891B2', text: '#164E63', label: 'PROJECT' };
    }
  };

  const { bg, text, label } = getColors();

  return (
    <div
      className="absolute w-24 h-24 overflow-hidden z-20"
      style={{
        top: '-2px',
        left: '-2px',
        pointerEvents: 'none',
        filter: 'drop-shadow(0 3px 10px rgba(0, 0, 0, 0.3))'
      }}
    >
      <div
        className="absolute transform -rotate-45 flex items-center justify-center"
        style={{
          width: '175px',
          height: '30px',
          top: '22px',
          left: '-52px',
          backgroundColor: bg,
        }}
      >
        <span
          className="font-bold"
          style={{
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            color: text,
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
            letterSpacing: type === 'in progress' ? '0.02em' : '0.05em',
            paddingTop: '1px',
            fontSize: type === 'in progress' ? '10px' : '16px',
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
};

export default RibbonBadge;
