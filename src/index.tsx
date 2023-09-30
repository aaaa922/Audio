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
          const audioFile = await window.openFile();

          const voiceMessage = await this.uploadAudioFile(audioFile);

          // Send the voice message.
          voiceClient.play(voiceMessage);
        }}>
          Upload Audio File
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
