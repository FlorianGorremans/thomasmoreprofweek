export const speakDialogue = (text, voiceProfile) => {
  if (!('speechSynthesis' in window)) {
    console.warn('Text-to-speech not supported in this browser.');
    return;
  }

  // Cancel any ongoing speech to prevent overlapping
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Basic settings from profile or defaults
  utterance.rate = voiceProfile?.rate || 1.0;
  utterance.pitch = voiceProfile?.pitch || 1.0;
  utterance.volume = 1.0;

  // Voice selection logic
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0 && voiceProfile?.type) {
    // Filter for English voices first
    const englishVoices = voices.filter(v => v.lang.startsWith('en'));
    
    // Fallback to all voices if no English ones found (unlikely, but safe)
    const voicePool = englishVoices.length > 0 ? englishVoices : voices;

    let selectedVoice = null;
    
    // Very basic heuristic for male/female voices based on common names/URIs 
    // since the API doesn't expose gender directly.
    if (voiceProfile.type === 'male') {
      selectedVoice = voicePool.find(v => 
        v.name.toLowerCase().includes('male') || 
        v.name.toLowerCase().includes('david') || 
        v.name.toLowerCase().includes('mark') ||
        v.name.toLowerCase().includes('guy') ||
        v.name.toLowerCase().includes('arthur')
      );
    } else if (voiceProfile.type === 'female') {
      selectedVoice = voicePool.find(v => 
        v.name.toLowerCase().includes('female') || 
        v.name.toLowerCase().includes('zira') || 
        v.name.toLowerCase().includes('samantha') ||
        v.name.toLowerCase().includes('victoria') ||
        v.name.toLowerCase().includes('hazel')
      );
    }

    // If we didn't find a gender match by name, just pick a default English voice
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    } else if (englishVoices.length > 0) {
      // As a fallback, try to differentiate by index if no names match (very crude)
      utterance.voice = voiceProfile.type === 'female' ? englishVoices[0] : (englishVoices[1] || englishVoices[0]);
    }
  }

  window.speechSynthesis.speak(utterance);
};
