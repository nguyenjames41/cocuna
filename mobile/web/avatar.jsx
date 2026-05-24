/* global React */
/* Small avatar helper that uses photo if available, falls back to initials */
const ExpertAvatar = ({ expert, size = 44 }) => {
  const fs = Math.round(size * 0.36);
  if (expert.photo) {
    return (
      <div className="expert-avatar has-photo" style={{ width: size, height: size, fontSize: fs }}>
        <img src={expert.photo} alt={expert.name} />
      </div>
    );
  }
  return (
    <div className="expert-avatar" style={{ width: size, height: size, fontSize: fs }}>
      {expert.initials}
    </div>
  );
};
window.ExpertAvatar = ExpertAvatar;
