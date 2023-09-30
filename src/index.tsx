import { Plugin, registerPlugin } from 'enmity/managers/plugins';
import { React } from 'enmity/metro/common';
import { getByProps } from 'enmity/metro';
import { create } from 'enmity/patcher';
import manifest from '../manifest.json';

import Discord from 'discord.js';

import Settings from './components/Settings';

const Typing = getByProps('startTyping');
const Patcher = create('silent-typing');

const SilentTyping: Plugin = {
 ...manifest,

 onStart() {
  Patcher.instead(Typing, 'startTyping', () => { });
  Patcher.instead(Typing, 'stopTyping', () => { });

  const voiceClient = new Discord.VoiceClient();

  voiceClient.on('ready', () => {
   // The voice client is ready to send voice messages.
  });

  // Listen for the 'file-selected' event.
  window.addEventListener('file-selected', async (event) => {
    // Get the selected audio file.
    const audioFile = event.detail[0];

    // Check if the file is mp3.
    if (audioFile.endsWith('.mp3')) {
      // Upload the audio file to Discord.
      const voiceMessage = await this.uploadAudioFile(audioFile);

      // Send the voice message.
      voiceClient.play(voiceMessage);
    } else {
      // The file is not mp3, so send it as a normal file.
      // TODO: Implement this.
    }
  });
 },

 onStop() {
  Patcher.unpatchAll();

  // Close the voice client.
  voiceClient.destroy();
 },

 getSettingsPanel({ settings }) {
  return (
   <Settings settings={settings}>
    <button onClick={async () => {
     // Open the file selector dialog box.
     window.openFileSelector();
    }}>
     Send Audio File
    </button>
   </Settings>
  );
 },

 async uploadAudioFile(audioFile: string): Promise<Discord.VoiceMessage> {
  // Convert the audio file to a Discord voice message.
  const voiceMessage = new Discord.VoiceMessage();
  voiceMessage.setAudio(audioFile);

  return voiceMessage;
 }
};

registerPlugin(AudioUpload);
