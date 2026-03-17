export const getEvidenceData = (victim) => {
  const victimName = victim?.name || 'the victim';
  
  return [
    {
      id: 'e1',
      title: 'Security Footage',
      icon: '📼',
      description: `A blurry timestamped clip showing someone in a dark coat entering ${victimName}'s office building via the fire escape. The person has a distinct limp or unusual gait.`
    },
    {
      id: 'e2',
      title: 'Shattered Whiskey Glass',
      icon: '🥃',
      description: `Found near the body. Partial fingerprints belonged to ${victimName}, but another smudged fingerprint was found that does not match them. It also smells faintly of a rare medical solvent.`
    },
    {
      id: 'e3',
      title: 'Threatening Text Message',
      icon: '📱',
      description: `A deleted message restored from ${victimName}'s phone sent hours before the murder. "You cut me out, you die. It's that simple." The sender ID was spoofed.`
    },
    {
      id: 'e4',
      title: 'The Bloody Letter Opener',
      icon: '🗡️',
      description: `The murder weapon. Found wiped clean but with traces of expensive oil paint on the handle.`
    }
  ];
};
